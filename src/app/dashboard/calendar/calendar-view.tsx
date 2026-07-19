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
import {
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from "@/actions/calendar";
import { toast } from "sonner";
import {
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Tag,
  Search,
  Trash2,
  Edit3,
  X,
  Info,
  CalendarDays,
  FileText,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

interface Event {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  description?: string;
  category?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Class: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Exam: "bg-red-500/10 text-red-400 border-red-500/20",
  Assignment: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Lab: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  General: "bg-neutral-500/10 text-neutral-400 border-neutral-500/20",
};

export default function CalendarView({
  user,
  events,
}: {
  user: any;
  events: Event[];
}) {
  const [state, action, pending] = useActionState(createCalendarEvent, null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isPending, startTransition] = useTransition();

  // Edit Form State
  const [editData, setEditData] = useState({
    title: "",
    start_time: "",
    end_time: "",
    description: "",
    category: "General",
  });

  useEffect(() => {
    if (state?.success) {
      toast.success("Event created successfully");
      setIsCreateOpen(false);
    }
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  const handleOpenEdit = (event: Event) => {
    // Format dates to datetime-local string format: YYYY-MM-DDTHH:MM
    const formatToLocalDatetime = (dateStr: string) => {
      const d = new Date(dateStr);
      const pad = (n: number) => n.toString().padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    setEditData({
      title: event.title,
      start_time: formatToLocalDatetime(event.start_time),
      end_time: formatToLocalDatetime(event.end_time),
      description: event.description || "",
      category: event.category || "General",
    });
    setIsEditMode(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    startTransition(async () => {
      const res = await updateCalendarEvent(selectedEvent.id, editData);
      if (res.success) {
        toast.success("Event updated successfully");
        setIsEditMode(false);
        setSelectedEvent({
          ...selectedEvent,
          ...editData,
        });
      } else {
        toast.error(res.error || "Failed to update event");
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    startTransition(async () => {
      const res = await deleteCalendarEvent(id);
      if (res.success) {
        toast.success("Event deleted successfully");
        setSelectedEvent(null);
      } else {
        toast.error(res.error || "Failed to delete event");
      }
    });
  };

  // Filter events based on search query and category
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.description || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <PageContainer>
      <SectionHeader
        title="Calendar Planner"
        description="Schedule exams, track class schedules, assignment due dates, and study sessions."
        action={
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2">
                <Plus size={16} /> Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-neutral-950 border border-neutral-800 text-neutral-100 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  Create Calendar Event
                </DialogTitle>
              </DialogHeader>
              <form action={action} className="space-y-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Event Title
                  </label>
                  <Input
                    name="title"
                    placeholder="e.g. Database Midterm Review"
                    required
                    className="bg-neutral-900 border-neutral-800 text-neutral-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                      Start Time
                    </label>
                    <Input
                      name="start_time"
                      type="datetime-local"
                      required
                      className="bg-neutral-900 border-neutral-800 text-neutral-100"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                      End Time
                    </label>
                    <Input
                      name="end_time"
                      type="datetime-local"
                      required
                      className="bg-neutral-900 border-neutral-800 text-neutral-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                      Category
                    </label>
                    <select
                      name="category"
                      defaultValue="General"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-sm text-neutral-100 focus:outline-none focus:border-indigo-500">
                      <option value="Class">Class</option>
                      <option value="Exam">Exam</option>
                      <option value="Assignment">Assignment</option>
                      <option value="Lab">Lab</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Description / Room
                  </label>
                  <textarea
                    name="description"
                    placeholder="e.g. Building 3, Room 102. Bring notebook."
                    rows={3}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-sm text-neutral-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white mt-2"
                  disabled={pending}>
                  {pending ? "Adding Event..." : "Create Event"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Filters and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-neutral-900/30 p-4 border border-neutral-800/80 rounded-xl mb-6">
        <div className="relative w-full md:w-96">
          <span className="absolute left-3.5 top-3 text-neutral-500">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search scheduled events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2 pl-10 pr-4 text-sm text-neutral-100 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {["All", "Class", "Exam", "Assignment", "Lab", "General"].map(
            (category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 ${
                  selectedCategory === category
                    ? "bg-indigo-600 border-indigo-500 text-white"
                    : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200"
                }`}>
                {category}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Main Work Area layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Events Lists */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-neutral-200 flex items-center gap-2">
            <CalendarIcon size={18} className="text-indigo-500" /> Matches (
            {filteredEvents.length})
          </h3>

          {filteredEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-neutral-800/60 rounded-xl bg-neutral-900/10">
              <CalendarDays size={40} className="text-neutral-600 mb-3" />
              <p className="text-neutral-400 text-sm">
                No scheduled events found.
              </p>
              <p className="text-neutral-600 text-xs mt-1">
                Try resetting your search query or add a new event!
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {filteredEvents.map((event) => {
                const categoryColor =
                  CATEGORY_COLORS[event.category || "General"];
                const eventStartDate = new Date(event.start_time);

                return (
                  <div
                    key={event.id}
                    onClick={() => {
                      setSelectedEvent(event);
                      setIsEditMode(false);
                    }}
                    className="cursor-pointer bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 p-4 rounded-xl shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between relative group">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded border font-semibold tracking-wider uppercase ${categoryColor}`}>
                          {event.category || "General"}
                        </span>
                        <span className="text-[10px] text-neutral-500 flex items-center gap-1">
                          <Clock size={10} />{" "}
                          {eventStartDate.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <h4 className="font-semibold text-neutral-100 text-sm group-hover:text-indigo-400 transition mb-1.5">
                        {event.title}
                      </h4>
                      {event.description && (
                        <p className="text-xs text-neutral-400 line-clamp-2 mb-3">
                          {event.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-neutral-800/60 flex justify-between items-center text-xs text-neutral-500">
                      <span>
                        {eventStartDate.toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <ChevronRight
                        size={14}
                        className="opacity-0 group-hover:opacity-100 text-indigo-400 transition"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Interactive Info/Edit Sidebar Drawer */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/20 p-5 flex flex-col min-h-[350px]">
          {selectedEvent ? (
            isEditMode ? (
              /* Edit Event Form */
              <form
                onSubmit={handleUpdate}
                className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <h3 className="font-bold text-neutral-200 flex items-center gap-2">
                      <Edit3 size={16} /> Edit Event
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsEditMode(false)}
                      className="text-neutral-500 hover:text-neutral-300">
                      <X size={16} />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-400 uppercase">
                      Title
                    </label>
                    <Input
                      value={editData.title}
                      onChange={(e) =>
                        setEditData({ ...editData, title: e.target.value })
                      }
                      required
                      className="bg-neutral-900 border-neutral-800 text-neutral-100"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-400 uppercase">
                      Category
                    </label>
                    <select
                      value={editData.category}
                      onChange={(e) =>
                        setEditData({ ...editData, category: e.target.value })
                      }
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-sm text-neutral-100">
                      <option value="Class">Class</option>
                      <option value="Exam">Exam</option>
                      <option value="Assignment">Assignment</option>
                      <option value="Lab">Lab</option>
                      <option value="General">General</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-400 uppercase">
                        Start Time
                      </label>
                      <Input
                        type="datetime-local"
                        value={editData.start_time}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            start_time: e.target.value,
                          })
                        }
                        required
                        className="bg-neutral-900 border-neutral-800 text-xs text-neutral-100"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-400 uppercase">
                        End Time
                      </label>
                      <Input
                        type="datetime-local"
                        value={editData.end_time}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            end_time: e.target.value,
                          })
                        }
                        required
                        className="bg-neutral-900 border-neutral-800 text-xs text-neutral-100"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-400 uppercase">
                      Description / Details
                    </label>
                    <textarea
                      value={editData.description}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-sm text-neutral-100 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-neutral-800/80 mt-auto">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditMode(false)}
                    className="flex-1 border-neutral-800 text-neutral-400 hover:text-neutral-200">
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white">
                    {isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            ) : (
              /* Event Detail Card */
              <div className="flex flex-col justify-between h-full flex-1">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded border font-semibold uppercase tracking-wider ${CATEGORY_COLORS[selectedEvent.category || "General"]}`}>
                      {selectedEvent.category || "General"}
                    </span>
                    <button
                      onClick={() => setSelectedEvent(null)}
                      className="text-neutral-500 hover:text-neutral-300">
                      <X size={16} />
                    </button>
                  </div>

                  <h3 className="font-bold text-neutral-100 text-lg">
                    {selectedEvent.title}
                  </h3>

                  <div className="space-y-2 text-sm text-neutral-400">
                    <div className="flex items-start gap-2.5">
                      <CalendarIcon
                        size={16}
                        className="text-neutral-500 mt-0.5"
                      />
                      <div>
                        <p className="text-xs font-medium text-neutral-500 uppercase">
                          Starts
                        </p>
                        <p className="text-neutral-200">
                          {new Date(selectedEvent.start_time).toLocaleString(
                            undefined,
                            { dateStyle: "medium", timeStyle: "short" },
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Clock size={16} className="text-neutral-500 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-neutral-500 uppercase">
                          Ends
                        </p>
                        <p className="text-neutral-200">
                          {new Date(selectedEvent.end_time).toLocaleString(
                            undefined,
                            { dateStyle: "medium", timeStyle: "short" },
                          )}
                        </p>
                      </div>
                    </div>

                    {selectedEvent.description && (
                      <div className="flex items-start gap-2.5 pt-2 border-t border-neutral-800/60 mt-2">
                        <FileText
                          size={16}
                          className="text-neutral-500 mt-0.5"
                        />
                        <div>
                          <p className="text-xs font-medium text-neutral-500 uppercase">
                            Notes / Location
                          </p>
                          <p className="text-neutral-200 mt-0.5 whitespace-pre-wrap">
                            {selectedEvent.description}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-neutral-800/80 mt-auto">
                  <Button
                    variant="outline"
                    onClick={() => handleOpenEdit(selectedEvent)}
                    disabled={isPending}
                    className="flex-1 border-neutral-800 text-neutral-300 hover:bg-neutral-800">
                    <Edit3 size={14} className="mr-1" /> Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(selectedEvent.id)}
                    disabled={isPending}
                    className="flex-1 bg-red-950/40 border border-red-800 text-red-400 hover:bg-red-900/30">
                    <Trash2 size={14} className="mr-1" /> Delete
                  </Button>
                </div>
              </div>
            )
          ) : (
            /* No Event Selected State */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
              <Info size={32} className="text-neutral-600 mb-2.5" />
              <h4 className="font-semibold text-neutral-300 text-sm">
                Select an Event
              </h4>
              <p className="text-neutral-500 text-xs mt-1 max-w-[200px]">
                Click any event card in the main list to view detailed
                scheduling info, edit its properties, or remove it entirely.
              </p>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
