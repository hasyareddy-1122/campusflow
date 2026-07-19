"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useEffect } from "react";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Ensure you have this component
import { Progress } from "@/components/ui/progress";
import { Plus, Trash2 } from "lucide-react";

interface Subject {
  id: string;
  subject_name: string;
  credits: number;
  conducted_classes: number;
  attended_classes: number;
  target_percentage: number;
}

export default function AttendancePage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSub, setNewSub] = useState({
    subject_name: "",
    credits: 1,
    conducted_classes: 0,
    attended_classes: 0,
    target_percentage: 75,
  });

  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    const fetchSubjects = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("attendance")
        .select("*")
        .eq("user_id", user.id)
        .order("subject_name");

      if (error) {
        console.error(error);
        return;
      }

      setSubjects(data || []);
    };

    fetchSubjects();
  }, []);

  const addSubject = async () => {
    if (!newSub.subject_name.trim()) return;

    if (newSub.attended_classes > newSub.conducted_classes) {
      alert("Classes attended cannot exceed classes conducted.");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please sign in.");
      return;
    }

    const response = await supabase.from("attendance").insert({
      user_id: user.id,
      subject_name: newSub.subject_name,
      credits: newSub.credits,
      conducted_classes: newSub.conducted_classes,
      attended_classes: newSub.attended_classes,
      target_percentage: newSub.target_percentage,
    });

    console.log(response);

    if (response.error) {
      console.log(response.error);
      alert("Failed to add subject.");
      return;
    }

    // Reload all subjects
    const { data } = await supabase
      .from("attendance")
      .select("*")
      .eq("user_id", user.id)
      .order("subject_name");

    setSubjects(data || []);

    // Reset form
    setNewSub({
      subject_name: "",
      credits: 1,
      conducted_classes: 0,
      attended_classes: 0,
      target_percentage: 75,
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Attendance Tracker</h1>

      {/* Add Subject Form with Labels */}
      <Card>
        <CardHeader>
          <CardTitle>Add Subject</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="name">Subject Name</Label>
            <Input
              id="name"
              placeholder="e.g., DAA"
              value={newSub.subject_name}
              onChange={(e) =>
                setNewSub({ ...newSub, subject_name: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="credits">Credits</Label>
            <Input
              id="credits"
              type="number"
              value={newSub.credits}
              onChange={(e) =>
                setNewSub({ ...newSub, credits: +e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="conducted">Classes Conducted</Label>
            <Input
              id="conducted"
              type="number"
              value={newSub.conducted_classes}
              onChange={(e) =>
                setNewSub({
                  ...newSub,
                  conducted_classes: +e.target.value,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="attended">Classes Attended</Label>
            <Input
              id="attended"
              type="number"
              value={newSub.attended_classes}
              onChange={(e) =>
                setNewSub({ ...newSub, attended_classes: +e.target.value })
              }
            />
          </div>
          <Button onClick={addSubject} className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Add Subject
          </Button>
        </CardContent>
      </Card>

      {/* Subjects List */}
      <div className="grid gap-4 md:grid-cols-2">
        {subjects.map((sub) => {
          const totalClasses = sub.credits * 15;

          const percentage =
            sub.conducted_classes > 0
              ? (sub.attended_classes / sub.conducted_classes) * 100
              : 0;

          const requiredAttendance = Math.ceil(
            (sub.target_percentage / 100) * totalClasses,
          );
          const needed = Math.max(0, requiredAttendance - sub.attended_classes);

          return (
            <Card key={sub.id}>
              <CardContent className="pt-6 space-y-3">
                <div className="flex justify-between font-bold text-lg">
                  {sub.subject_name}
                  <Trash2
                    className="cursor-pointer text-destructive h-4 w-4"
                    onClick={async () => {
                      const { error } = await supabase
                        .from("attendance")
                        .delete()
                        .eq("id", sub.id);

                      if (error) {
                        console.error(error);
                        return;
                      }

                      setSubjects(subjects.filter((s) => s.id !== sub.id));
                    }}
                  />
                </div>
                <Progress value={percentage} />
                <p className="text-sm">
                  Attendance: {percentage.toFixed(1)}% ({sub.attended_classes}/
                  {sub.conducted_classes} classes)
                </p>
                <p className="text-sm text-muted-foreground">
                  Total Semester Classes: {totalClasses}
                </p>

                <p className="text-sm text-muted-foreground">
                  Target Attendance: {sub.target_percentage}%
                </p>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Target (%)</Label>
                    <Input
                      type="number"
                      value={sub.target_percentage}
                      onChange={async (e) => {
                        const value = +e.target.value;

                        setSubjects(
                          subjects.map((s) =>
                            s.id === sub.id
                              ? { ...s, target_percentage: value }
                              : s,
                          ),
                        );

                        await supabase
                          .from("attendance")
                          .update({ target_percentage: value })
                          .eq("id", sub.id);
                      }}
                      className="h-8"
                    />
                  </div>
                  <div className="space-y-1 flex flex-col justify-end">
                    <p className="text-xs text-muted-foreground">
                      Classes needed:
                    </p>
                    <p className="font-bold text-primary">
                      {needed} classes
                    </p>{" "}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
