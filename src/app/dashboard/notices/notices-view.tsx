"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useActionState } from "react";
import { PageContainer } from "@/components/shared/page-container";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  addNotice,
  updateNotice,
  deleteNotice,
  summarizeNotice,
} from "@/actions/notices"; // Added import here
import { toast } from "sonner";
import {
  Plus,
  Search,
  Trash2,
  Edit3,
  X,
  Sparkles,
  FileText,
  Calendar,
  ChevronRight,
  Info,
} from "lucide-react";

interface Notice {
  id: string;
  title: string;
  original_text: string;
  ai_summary: string | null;
  created_at: string;
}

export default function NoticesView({
  user,
  notices: initialNotices,
}: {
  user: any;
  notices: Notice[];
}) {
  const [notices, setNotices] = useState<Notice[]>(initialNotices);
  const [state, action, pending] = useActionState(addNotice, null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [summarizingStates, setSummarizingStates] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    if (state?.success) {
      toast.success("Notice uploaded successfully");
      setIsCreateOpen(false);
    }
  }, [state]);

  const handleAiSummarize = async (notice: Notice) => {
    setSummarizingStates((prev) => ({ ...prev, [notice.id]: true }));
    try {
      const summary = await summarizeNotice(notice.original_text);
      const res = await updateNotice(notice.id, {
        title: notice.title,
        original_text: notice.original_text,
        ai_summary: summary,
      });

      if (res.success) {
        toast.success("Summary generated!");
        const updatedNotice = { ...notice, ai_summary: summary };
        setSelectedNotice(updatedNotice);
        setNotices((prev) =>
          prev.map((n) => (n.id === notice.id ? updatedNotice : n)),
        );
      } else {
        toast.error(res.error || "Update failed");
      }
    } catch (e) {
      toast.error("Failed to generate summary");
    } finally {
      setSummarizingStates((prev) => ({ ...prev, [notice.id]: false }));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    startTransition(async () => {
      const res = await deleteNotice(id);
      if (res.success) {
        toast.success("Deleted");
        setSelectedNotice(null);
        setNotices((prev) => prev.filter((n) => n.id !== id));
      } else {
        toast.error("Failed to delete");
      }
    });
  };

  const filteredNotices = notices.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.original_text.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <PageContainer>
      <SectionHeader
        title="Notice Summarizer"
        description="AI-powered circular analysis."
        action={
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus size={16} /> New Notice
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-neutral-950 border border-neutral-800 text-neutral-100">
              <DialogHeader>
                <DialogTitle>Upload College Notice</DialogTitle>
              </DialogHeader>
              <form action={action} className="space-y-4">
                <Input name="title" placeholder="Title" required />
                <textarea
                  name="text"
                  required
                  rows={8}
                  className="w-full bg-neutral-900 border p-2 text-sm"
                />
                <Button disabled={pending}>
                  {pending ? "Analyzing..." : "Upload & Analyze"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {filteredNotices.map((notice) => (
            <Card
              key={notice.id}
              onClick={() => setSelectedNotice(notice)}
              className="cursor-pointer border-neutral-800 hover:border-indigo-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-md">{notice.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {notice.ai_summary ? (
                  <p className="text-sm text-neutral-300 line-clamp-2">
                    {notice.ai_summary}
                  </p>
                ) : (
                  <p className="text-sm text-neutral-500 italic">
                    No summary available yet.
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Reader Pane */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/20 p-5">
          {selectedNotice ? (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">{selectedNotice.title}</h3>
              <div className="bg-indigo-500/5 border p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-indigo-400 text-xs font-bold flex items-center gap-1">
                    <Sparkles size={12} /> AI Summary
                  </span>
                  {!selectedNotice.ai_summary && (
                    <Button
                      size="sm"
                      onClick={() => handleAiSummarize(selectedNotice)}
                      disabled={summarizingStates[selectedNotice.id]}>
                      {summarizingStates[selectedNotice.id]
                        ? "Generating..."
                        : "Generate Summary"}
                    </Button>
                  )}
                </div>
                <p className="text-sm">
                  {selectedNotice.ai_summary || "Click Generate to summarize."}
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={() => handleDelete(selectedNotice.id)}>
                Delete
              </Button>
            </div>
          ) : (
            <div className="text-center py-20 text-neutral-600">
              <Info size={40} className="mx-auto mb-2" />
              Select a notice.
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
