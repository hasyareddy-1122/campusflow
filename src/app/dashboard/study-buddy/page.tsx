"use client";

import React, { useState, useEffect, useMemo } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateStudyPlan } from "@/lib/ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function StudyBuddyPage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [isMounted, setIsMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [setup, setSetup] = useState({ timetable: "", numSubjects: 1 });
  const [subjects, setSubjects] = useState<any[]>([]);
  const [generatedRoadmaps, setGeneratedRoadmaps] = useState<any[]>([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const fetchRoadmaps = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("study_roadmaps")
        .select("*")
        .eq("user_id", user.id);

      if (error) console.error("Fetch Error:", error);
      if (data) {
        setGeneratedRoadmaps(
          data.map((item) => ({
            subject: item.subject_name,
            dailyPlan: item.generated_roadmap,
          })),
        );
      }
    };
    fetchRoadmaps();
  }, [isMounted, supabase]);

  if (!isMounted) return null;

  const handleSetup = () => {
    setSubjects(
      Array(setup.numSubjects).fill({
        name: "",
        examDate: "",
        syllabus: [{ topic: "", complexity: "medium" }],
      }),
    );
    setStep(2);
  };

  const generateRoadmaps = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("Please log in!");
      return;
    }

    try {
      const savedPlans = await Promise.all(
        subjects.map(async (sub) => {
          const topicNames = sub.syllabus.map((s: any) => s.topic);

          // AI returns array of {dayIndex: number, topic: string, hours: number}
          const aiPlan = await generateStudyPlan(
            sub.name,
            topicNames,
            sub.examDate,
            setup.timetable,
          );

          const today = new Date();
          const finalPlan = aiPlan.map((item: any) => {
            const targetDate = new Date();
            targetDate.setDate(today.getDate() + (item.dayIndex - 1));
            return {
              day: targetDate.toISOString().split("T")[0],
              topic: item.topic,
              hours: item.hours,
            };
          });

          await supabase.from("study_roadmaps").insert({
            user_id: user.id,
            subject_name: sub.name,
            exam_date: sub.examDate,
            syllabus_data: sub.syllabus,
            generated_roadmap: finalPlan,
          });

          return { subject: sub.name, dailyPlan: finalPlan };
        }),
      );

      setGeneratedRoadmaps(savedPlans);
      setStep(3);
      alert("AI Strategy generated successfully!");
    } catch (error) {
      console.error("AI Generation Error:", error);
      alert("Failed to generate AI plan. Please check your API key.");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Smart Study Buddy</h1>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Setup Environment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Label>College Timetable</Label>
            <Input
              placeholder="e.g., Mon-Fri 9am-4pm"
              value={setup.timetable}
              onChange={(e) =>
                setSetup({ ...setup, timetable: e.target.value })
              }
            />
            <Label>Number of Subjects</Label>
            <Input
              type="number"
              value={setup.numSubjects}
              onChange={(e) =>
                setSetup({
                  ...setup,
                  numSubjects: parseInt(e.target.value) || 1,
                })
              }
            />
            <Button className="w-full" onClick={handleSetup}>
              Proceed
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <div className="space-y-4">
          {subjects.map((sub, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle>Subject {idx + 1}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Subject Name"
                  onChange={(e) => {
                    const n = [...subjects];
                    n[idx].name = e.target.value;
                    setSubjects(n);
                  }}
                />
                <Input
                  type="date"
                  onChange={(e) => {
                    const n = [...subjects];
                    n[idx].examDate = e.target.value;
                    setSubjects(n);
                  }}
                />
                {sub.syllabus.map((item: any, sIdx: number) => (
                  <div key={sIdx} className="flex gap-2">
                    <Input
                      placeholder="Topic Name"
                      onChange={(e) => {
                        const n = [...subjects];
                        n[idx].syllabus[sIdx].topic = e.target.value;
                        setSubjects(n);
                      }}
                    />
                    <select
                      className="border rounded px-2"
                      onChange={(e) => {
                        const n = [...subjects];
                        n[idx].syllabus[sIdx].complexity = e.target.value;
                        setSubjects(n);
                      }}>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => {
                    const n = [...subjects];
                    n[idx].syllabus.push({ topic: "", complexity: "medium" });
                    setSubjects(n);
                  }}>
                  + Add Topic
                </Button>
              </CardContent>
            </Card>
          ))}
          <Button className="w-full" onClick={generateRoadmaps}>
            Generate & Save Plan
          </Button>
        </div>
      )}

      {(step === 3 || generatedRoadmaps.length > 0) && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Your Saved Roadmaps</h2>
          {generatedRoadmaps.map((sub, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle>{sub.subject}</CardTitle>
              </CardHeader>
              <CardContent>
                {sub.dailyPlan.map((p: any, pIdx: number) => (
                  <div
                    key={pIdx}
                    className="flex justify-between border-b py-2 text-sm">
                    <span>
                      {p.day}: <strong>{p.topic}</strong>
                    </span>
                    <span className="text-muted-foreground">
                      {p.hours} hours
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
