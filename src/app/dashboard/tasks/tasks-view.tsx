"use client";

import React, { useState, useTransition } from "react";
import {
  Plus,
  Calendar,
  BookOpen,
  Phone,
  Clock,
  Trash2,
  ArrowRight,
  ArrowLeft,
  X,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { createTask, updateTask, deleteTask } from "../../../actions/tasks";

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: "TODO" | "IN_PROGRESS" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  deadline?: string | null;
  phone?: string | null;
}

interface TasksViewProps {
  initialTasks?: any[];
}

export default function TasksView({ initialTasks = [] }: TasksViewProps) {
  const [tasks, setTasks] = useState<Task[]>((initialTasks as Task[]) || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "HIGH" as "LOW" | "MEDIUM" | "HIGH",
    deadline: "",
    phone: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
    submitData.append("priority", formData.priority);
    submitData.append("status", "TODO");
    submitData.append("deadline", formData.deadline);
    submitData.append("phone", formData.phone);

    startTransition(async () => {
      const result = await createTask(null, submitData);

      if (result && "error" in result) {
        setError(result.error || "Failed to create task");
      } else {
        const mockNewTask: Task = {
          id: crypto.randomUUID(),
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          status: "TODO",
          deadline: formData.deadline
            ? new Date(formData.deadline).toISOString()
            : null,
          phone: formData.phone,
        };

        setTasks((prev) => [mockNewTask, ...prev]);
        setIsModalOpen(false);
        setFormData({
          title: "",
          description: "",
          priority: "HIGH",
          deadline: "",
          phone: "",
        });
      }
    });
  };

  const handleStatusTransition = async (
    taskId: string,
    currentStatus: "TODO" | "IN_PROGRESS" | "COMPLETED",
    direction: "forward" | "backward",
  ) => {
    let nextStatus: "TODO" | "IN_PROGRESS" | "COMPLETED" = currentStatus;

    if (direction === "forward") {
      if (currentStatus === "TODO") nextStatus = "IN_PROGRESS";
      else if (currentStatus === "IN_PROGRESS") nextStatus = "COMPLETED";
    } else {
      if (currentStatus === "COMPLETED") nextStatus = "IN_PROGRESS";
      else if (currentStatus === "IN_PROGRESS") nextStatus = "TODO";
    }

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t)),
    );

    try {
      await updateTask(taskId, { status: nextStatus });
    } catch (err) {
      console.error("Failed to sync status update with database:", err);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, status: currentStatus } : t,
        ),
      );
    }
  };

  const handleTaskDelete = async (taskId: string) => {
    const backupTasks = [...tasks];
    setTasks((prev) => prev.filter((t) => t.id !== taskId));

    try {
      await deleteTask(taskId);
    } catch (err) {
      console.error("Failed to delete task from Supabase:", err);
      setTasks(backupTasks);
    }
  };

  const getPriorityColor = (priority: "LOW" | "MEDIUM" | "HIGH") => {
    switch (priority) {
      case "HIGH":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
      case "MEDIUM":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      default:
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    }
  };

  const renderColumn = (
    columnStatus: "TODO" | "IN_PROGRESS" | "COMPLETED",
    title: string,
    color: string,
  ) => {
    const columnTasks = (tasks || []).filter((t) => t.status === columnStatus);
    return (
      <div className="flex-1 min-w-[300px] bg-neutral-900/30 border border-neutral-800/80 rounded-2xl p-5 flex flex-col min-h-[550px] backdrop-blur-md">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-neutral-800/50">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${color} animate-pulse`}></span>
            <h3 className="font-semibold text-neutral-200 tracking-wider text-sm uppercase">
              {title}
            </h3>
          </div>
          <span className="text-xs bg-neutral-800 text-neutral-400 px-3 py-1 rounded-full font-medium">
            {columnTasks.length}
          </span>
        </div>

        <div className="flex flex-col gap-3.5 flex-1 overflow-y-auto max-h-[600px] pr-1 scrollbar-thin scrollbar-thumb-neutral-800">
          {columnTasks.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 text-sm border border-dashed border-neutral-800/60 rounded-xl bg-neutral-900/10">
              Empty column
            </div>
          ) : (
            columnTasks.map((task) => (
              <div
                key={task.id}
                className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-4.5 hover:border-neutral-700/80 hover:bg-neutral-900 transition duration-200 group relative shadow-lg">
                <div className="flex justify-between items-start gap-2 mb-3">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded font-semibold uppercase tracking-wider">
                      {task.description || "General"}
                    </span>
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded font-semibold uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <button
                    onClick={() => handleTaskDelete(task.id)}
                    className="text-neutral-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition duration-150 p-1 rounded-md hover:bg-rose-500/5">
                    <Trash2 size={15} />
                  </button>
                </div>

                <h4 className="font-bold text-neutral-100 text-[15px] tracking-tight mb-3 line-clamp-2">
                  {task.title}
                </h4>

                <div className="space-y-2 mb-4 pt-1 border-t border-neutral-800/30">
                  {task.deadline && (
                    <div className="flex items-center gap-2 text-xs text-neutral-400">
                      <Calendar size={13} className="text-indigo-400/80" />
                      <span>
                        {new Date(task.deadline).toLocaleString([], {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>
                  )}
                  {task.phone && (
                    <div className="flex items-center gap-2 text-xs text-neutral-400">
                      <Phone size={13} className="text-emerald-400/80" />
                      <span className="font-mono tracking-wide">
                        {task.phone}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-neutral-800/40">
                  <span className="text-[10px] text-neutral-500 uppercase font-semibold tracking-wider">
                    Actions
                  </span>
                  <div className="flex gap-1.5">
                    {columnStatus !== "TODO" && (
                      <button
                        onClick={() =>
                          handleStatusTransition(
                            task.id,
                            columnStatus,
                            "backward",
                          )
                        }
                        className="p-1.5 rounded-lg bg-neutral-800/80 hover:bg-neutral-800 hover:text-white text-neutral-400 text-xs transition border border-neutral-800"
                        title="Move Back">
                        <ArrowLeft size={13} />
                      </button>
                    )}
                    {columnStatus !== "COMPLETED" && (
                      <button
                        onClick={() =>
                          handleStatusTransition(
                            task.id,
                            columnStatus,
                            "forward",
                          )
                        }
                        className="py-1 px-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 shadow-md shadow-indigo-600/10 transition"
                        title="Move Forward">
                        Next <ArrowRight size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 text-neutral-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-indigo-500/10 text-indigo-400 p-1.5 rounded-lg border border-indigo-500/20">
              <Sparkles size={18} />
            </span>
            <span className="text-xs text-indigo-400 font-semibold tracking-widest uppercase">
              Smart CampusFlow Pipeline
            </span>
          </div>
          <div className="pb-6 border-b border-border/50 mb-8">
            <h1 className="text-5xl font-extrabold tracking-tighter bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Assignment Canvas
            </h1>
          </div>
          <p className="text-neutral-400 mt-1.5 text-sm">
            Create visual assignment tasks and instantly coordinate automated
            WhatsApp & Calendar reminders.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5.5 py-3 rounded-xl font-bold flex items-center gap-2.5 shadow-xl hover:shadow-indigo-600/15 transition-all duration-200 text-sm border border-indigo-500/50">
          <Plus size={16} />
          Create Task
        </button>
      </div>

      <div className="flex flex-wrap gap-6 items-start">
        {renderColumn("TODO", "Todo / Unscheduled", "bg-amber-500")}
        {renderColumn("IN_PROGRESS", "Active Progress", "bg-sky-500")}
        {renderColumn("COMPLETED", "Fully Completed", "bg-emerald-500")}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-neutral-950 border border-neutral-800/90 w-full max-w-md rounded-2xl p-6.5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4.5 top-4.5 text-neutral-500 hover:text-neutral-300 p-1 hover:bg-neutral-900 rounded-lg transition">
              <X size={18} />
            </button>

            {/* HIGHLY VISIBLE SYSTEM IDENTIFICATION BADGE */}
            <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase mb-3">
              <Sparkles size={11} className="animate-spin text-amber-400" />
              Automation Active
            </div>

            <h3 className="text-xl font-bold text-neutral-100 mb-1 flex items-center gap-2">
              Create New Smart Task
            </h3>
            <p className="text-xs text-neutral-400 mb-6">
              Triggers an instant automatic Google Calendar sync and schedules
              WhatsApp alerts.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                  Task Name / Assignment Title
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Prepare for Database Presentation"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2.5 pl-3.5 pr-10 text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                  <Clock
                    className="absolute right-3.5 top-3 text-neutral-500"
                    size={16}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                    Subject / Category
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="e.g. DBMS"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2.5 pl-3.5 pr-10 text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                    <BookOpen
                      className="absolute right-3.5 top-3 text-neutral-500"
                      size={16}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                    Priority Label
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2.5 px-3.5 text-sm text-neutral-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none">
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                  Deadline Date & Time
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    name="deadline"
                    required
                    value={formData.deadline}
                    onChange={handleInputChange}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2.5 px-3.5 text-sm text-neutral-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                  WhatsApp Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. 919110373200"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2.5 pl-3.5 pr-10 text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                  <Phone
                    className="absolute right-3.5 top-3 text-neutral-500"
                    size={16}
                  />
                </div>
                <span className="text-[10px] text-neutral-500 mt-1 block pl-1">
                  Format: Country Code + Number (e.g. 919110373200) without `+`
                  or spaces.
                </span>
              </div>

              {error && (
                <div className="text-xs bg-rose-950/40 border border-rose-800/50 text-rose-400 p-3 rounded-xl flex items-center gap-2">
                  <AlertTriangle size={14} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-neutral-900 mt-5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 py-2.5 rounded-xl text-sm font-semibold transition">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/15 transition flex items-center justify-center gap-2">
                  {isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    "Save & Deploy"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
