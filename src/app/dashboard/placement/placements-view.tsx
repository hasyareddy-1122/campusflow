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
import { Table } from "@/components/shared/table";
import {
  createPlacementApplication,
  updatePlacementApplication,
  deletePlacementApplication,
} from "@/actions/placements";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Briefcase,
  Calendar,
  GraduationCap,
  DollarSign,
  Trash2,
  Edit3,
  X,
  Eye,
  FileText,
  ChevronRight,
  Info,
  CheckCircle,
  TrendingUp,
  Clock,
  AlertCircle,
} from "lucide-react";

interface Application {
  id: string;
  company_id: string;
  role: string;
  status: "APPLIED" | "INTERVIEWING" | "OFFERED" | "REJECTED";
  applied_date: string;
  salary?: string | null;
  notes?: string | null;
  created_at: string;
  company?: { name: string } | null;
}

interface PlacementsViewProps {
  user: any;
  applications: Application[];
  companies: { id: string; name: string }[];
}

const STATUS_BADGES: Record<string, string> = {
  APPLIED: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  INTERVIEWING: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  OFFERED: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  REJECTED: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
};

export default function PlacementsView({
  user,
  applications = [],
  companies = [],
}: PlacementsViewProps) {
  const [state, action, pending] = useActionState(
    createPlacementApplication,
    null,
  );
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isPending, startTransition] = useTransition();

  // Edit Form State
  const [editData, setEditData] = useState({
    company_name: "",
    role: "",
    status: "APPLIED",
    applied_date: "",
    salary: "",
    notes: "",
  });

  useEffect(() => {
    if (state?.success) {
      toast.success("Job application tracked successfully!");
      setIsCreateOpen(false);
    }
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  const handleOpenEdit = (app: Application) => {
    const formatToLocalDate = (dateStr: string) => {
      const d = new Date(dateStr);
      const pad = (n: number) => n.toString().padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    };

    setEditData({
      company_name: app.company?.name || "",
      role: app.role || "Software Engineer",
      status: app.status || "APPLIED",
      applied_date: formatToLocalDate(app.applied_date || app.created_at),
      salary: app.salary || "",
      notes: app.notes || "",
    });
    setIsEditMode(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    startTransition(async () => {
      const res = await updatePlacementApplication(selectedApp.id, editData);
      if (res.success) {
        toast.success("Application details updated successfully");
        setIsEditMode(false);
        setSelectedApp({
          ...selectedApp,
          role: editData.role,
          status: editData.status as any,
          applied_date: new Date(editData.applied_date).toISOString(),
          salary: editData.salary,
          notes: editData.notes,
          company: { name: editData.company_name },
        });
      } else {
        toast.error(res.error || "Failed to update details");
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job application track?"))
      return;

    startTransition(async () => {
      const res = await deletePlacementApplication(id);
      if (res.success) {
        toast.success("Application track removed successfully");
        setSelectedApp(null);
      } else {
        toast.error(res.error || "Failed to delete application");
      }
    });
  };

  const filteredApps = applications.filter((app) => {
    const cName = (app.company?.name || "").toLowerCase();
    const roleName = (app.role || "").toLowerCase();
    const notesContent = (app.notes || "").toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      cName.includes(query) ||
      roleName.includes(query) ||
      notesContent.includes(query);
    const matchesStatus = statusFilter === "All" || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate Metrics
  const totalApplied = applications.length;
  const interviewingCount = applications.filter(
    (a) => a.status === "INTERVIEWING",
  ).length;
  const offersReceived = applications.filter(
    (a) => a.status === "OFFERED",
  ).length;

  return (
    <PageContainer>
      {}
      <SectionHeader
        title="Placement & Internship Tracker"
        description="Monitor corporate job profiles, schedule rounds, register salary pack structures, and coordinate interviews."
        action={
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2 shadow-lg shadow-indigo-600/10">
                <Plus size={16} /> Track New Application
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-neutral-950 border border-neutral-800 text-neutral-100 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  Track Job Application
                </DialogTitle>
              </DialogHeader>
              <form action={action} className="space-y-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Company Name
                  </label>
                  <Input
                    name="company_name"
                    placeholder="e.g. Google, Microsoft, or Local Startup"
                    required
                    className="bg-neutral-900 border-neutral-800 text-neutral-100 focus-visible:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                      Target Role
                    </label>
                    <Input
                      name="role"
                      placeholder="e.g. Frontend Intern"
                      defaultValue="Software Engineer"
                      required
                      className="bg-neutral-900 border-neutral-800 text-neutral-100"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                      Application Status
                    </label>
                    <select
                      name="status"
                      defaultValue="APPLIED"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-sm text-neutral-100 focus:outline-none focus:border-indigo-500 h-10">
                      <option value="APPLIED">Applied</option>
                      <option value="INTERVIEWING">Interviewing</option>
                      <option value="OFFERED">Offered</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                      Applied Date
                    </label>
                    <Input
                      name="applied_date"
                      type="date"
                      defaultValue={new Date().toISOString().split("T")[0]}
                      className="bg-neutral-900 border-neutral-800 text-neutral-100 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                      Salary Package / Stipend
                    </label>
                    <Input
                      name="salary"
                      placeholder="e.g. $120k/yr or $30/hr"
                      className="bg-neutral-900 border-neutral-800 text-neutral-100"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Interview Rounds & Notes
                  </label>
                  <textarea
                    name="notes"
                    placeholder="e.g. Technical Round 1 finished. Leetcode Medium."
                    rows={4}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-sm text-neutral-100 focus:outline-none focus:border-indigo-500 placeholder:text-neutral-600"
                  />
                </div>

                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white mt-2 font-bold"
                  disabled={pending}>
                  {pending ? "Adding Record..." : "Track Application"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {}
      <div className="grid gap-4 grid-cols-3 mb-6">
        <Card className="bg-neutral-900/40 border-neutral-800/80 p-4 flex items-center gap-4.5">
          <div className="p-3 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
            <Briefcase size={20} />
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Total Tracks
            </p>
            <h4 className="text-2xl font-bold text-neutral-100 mt-1">
              {totalApplied}
            </h4>
          </div>
        </Card>
        <Card className="bg-neutral-900/40 border-neutral-800/80 p-4 flex items-center gap-4.5">
          <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Active Rounds
            </p>
            <h4 className="text-2xl font-bold text-neutral-100 mt-1">
              {interviewingCount}
            </h4>
          </div>
        </Card>
        <Card className="bg-neutral-900/40 border-neutral-800/80 p-4 flex items-center gap-4.5">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
            <CheckCircle size={20} />
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Offers Grabbed
            </p>
            <h4 className="text-2xl font-bold text-neutral-100 mt-1">
              {offersReceived}
            </h4>
          </div>
        </Card>
      </div>

      {}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-neutral-900/30 p-4 border border-neutral-800/80 rounded-xl mb-6">
        <div className="relative w-full md:w-96">
          <span className="absolute left-3.5 top-3 text-neutral-500">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search company, job role, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2 pl-10 pr-4 text-sm text-neutral-100 focus:outline-none focus:border-indigo-500 placeholder:text-neutral-500"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {["All", "APPLIED", "INTERVIEWING", "OFFERED", "REJECTED"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 ${
                  statusFilter === status
                    ? "bg-indigo-600 border-indigo-500 text-white"
                    : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200"
                }`}>
                {status}
              </button>
            ),
          )}
        </div>
      </div>

      {}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main List container */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-neutral-200 flex items-center gap-2">
            <Briefcase size={18} className="text-indigo-500" /> Tracked
            Applications ({filteredApps.length})
          </h3>

          {filteredApps.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-neutral-800/50 rounded-xl bg-neutral-900/10">
              <Briefcase
                size={40}
                className="text-neutral-600 mb-3 animate-pulse"
              />
              <p className="text-neutral-400 text-sm">
                No recorded applications found.
              </p>
              <p className="text-neutral-600 text-xs mt-1">
                Register your active job, internship, or fulltime placement
                tracks above.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredApps.map((app) => (
                <Card
                  key={app.id}
                  onClick={() => {
                    setSelectedApp(app);
                    setIsEditMode(false);
                  }}
                  className="cursor-pointer bg-neutral-900/40 border-neutral-800 hover:border-neutral-700 transition duration-200 group shadow-sm hover:shadow-md">
                  <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
                    <div className="space-y-1">
                      <CardTitle className="text-md font-bold text-neutral-100 group-hover:text-indigo-400 transition flex items-center gap-2.5">
                        {app.company?.name || "Unknown"}
                      </CardTitle>
                      <p className="text-xs text-neutral-400 font-semibold">
                        {app.role || "Software Engineer"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold tracking-wider uppercase ${STATUS_BADGES[app.status]}`}>
                        {app.status}
                      </span>
                      <ChevronRight
                        size={16}
                        className="text-neutral-600 group-hover:text-indigo-400 transition"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="flex justify-between items-center text-xs text-neutral-500 pt-0">
                    <div className="flex gap-4">
                      {app.salary && (
                        <span className="flex items-center gap-1 text-emerald-400 font-medium">
                          <DollarSign size={12} /> {app.salary}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        Applied{" "}
                        {new Date(
                          app.applied_date || app.created_at,
                        ).toLocaleDateString(undefined, {
                          dateStyle: "medium",
                        })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/20 p-5 flex flex-col min-h-[400px]">
          {selectedApp ? (
            isEditMode ? (
              /* Edit application form */
              <form
                onSubmit={handleUpdate}
                className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <h3 className="font-bold text-neutral-200 flex items-center gap-2">
                      <Edit3 size={16} /> Edit Track Details
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
                      Company Name
                    </label>
                    <Input
                      value={editData.company_name}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          company_name: e.target.value,
                        })
                      }
                      required
                      className="bg-neutral-900 border-neutral-800 text-neutral-100"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-400 uppercase">
                      Role
                    </label>
                    <Input
                      value={editData.role}
                      onChange={(e) =>
                        setEditData({ ...editData, role: e.target.value })
                      }
                      required
                      className="bg-neutral-900 border-neutral-800 text-neutral-100"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-400 uppercase">
                        Status
                      </label>
                      <select
                        value={editData.status}
                        onChange={(e) =>
                          setEditData({ ...editData, status: e.target.value })
                        }
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs text-neutral-100 h-9">
                        <option value="APPLIED">Applied</option>
                        <option value="INTERVIEWING">Interviewing</option>
                        <option value="OFFERED">Offered</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-400 uppercase">
                        Salary Structure
                      </label>
                      <Input
                        value={editData.salary}
                        onChange={(e) =>
                          setEditData({ ...editData, salary: e.target.value })
                        }
                        className="bg-neutral-900 border-neutral-800 text-xs h-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-400 uppercase">
                      Applied Date
                    </label>
                    <Input
                      type="date"
                      value={editData.applied_date}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          applied_date: e.target.value,
                        })
                      }
                      className="bg-neutral-900 border-neutral-800 text-xs text-neutral-100"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-400 uppercase">
                      Rounds & Prep Notes
                    </label>
                    <textarea
                      value={editData.notes}
                      onChange={(e) =>
                        setEditData({ ...editData, notes: e.target.value })
                      }
                      rows={4}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs text-neutral-100 focus:outline-none"
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
              /* View Application Details Card */
              <div className="flex flex-col justify-between h-full flex-1">
                <div className="space-y-4 overflow-y-auto max-h-[500px] pr-1">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded border font-bold uppercase tracking-wider ${STATUS_BADGES[selectedApp.status]}`}>
                      {selectedApp.status}
                    </span>
                    <button
                      onClick={() => setSelectedApp(null)}
                      className="text-neutral-500 hover:text-neutral-300">
                      <X size={16} />
                    </button>
                  </div>

                  <div>
                    <h3 className="font-bold text-neutral-100 text-xl leading-tight">
                      {selectedApp.company?.name || "Unknown"}
                    </h3>
                    <p className="text-xs text-indigo-400 font-semibold mt-1 flex items-center gap-1">
                      <GraduationCap size={13} />{" "}
                      {selectedApp.role || "Software Engineer"}
                    </p>
                  </div>

                  <div className="space-y-3.5 pt-2 border-t border-neutral-800/40 text-sm text-neutral-400">
                    <div className="flex items-center gap-2.5">
                      <Calendar size={15} className="text-neutral-500" />
                      <div>
                        <p className="text-[10px] font-bold text-neutral-500 uppercase">
                          Applied On
                        </p>
                        <p className="text-neutral-200">
                          {new Date(
                            selectedApp.applied_date || selectedApp.created_at,
                          ).toLocaleDateString(undefined, {
                            dateStyle: "medium",
                          })}
                        </p>
                      </div>
                    </div>

                    {selectedApp.salary && (
                      <div className="flex items-center gap-2.5">
                        <DollarSign size={15} className="text-emerald-500" />
                        <div>
                          <p className="text-[10px] font-bold text-neutral-500 uppercase">
                            Package / Stipend Offered
                          </p>
                          <p className="text-neutral-200 font-mono">
                            {selectedApp.salary}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-neutral-800/40">
                      <p className="text-[10px] font-bold text-neutral-500 uppercase mb-1.5 flex items-center gap-1">
                        <FileText size={12} /> Preparation Notes
                      </p>
                      <div className="bg-neutral-900/60 rounded-xl p-3 border border-neutral-800/60 max-h-40 overflow-y-auto">
                        <p className="text-xs text-neutral-300 leading-relaxed whitespace-pre-wrap">
                          {selectedApp.notes ||
                            "No notes registered. Click edit below to add notes about interview rounds, questions, and contact points."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-neutral-800/80 mt-auto">
                  <Button
                    variant="outline"
                    onClick={() => handleOpenEdit(selectedApp)}
                    disabled={isPending}
                    className="flex-1 border-neutral-800 text-neutral-300 hover:bg-neutral-800">
                    <Edit3 size={14} className="mr-1" /> Edit Track
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(selectedApp.id)}
                    disabled={isPending}
                    className="flex-1 bg-red-950/40 border border-red-800 text-red-400 hover:bg-red-900/30">
                    <Trash2 size={14} className="mr-1" /> Delete
                  </Button>
                </div>
              </div>
            )
          ) : (
            /* Selected App Placeholder */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
              <Info size={32} className="text-neutral-600 mb-2.5" />
              <h4 className="font-semibold text-neutral-300 text-sm">
                Select an Application
              </h4>
              <p className="text-neutral-500 text-xs mt-1 max-w-[200px]">
                Click on any corporate job tracker card inside the main feed to
                examine interview details, salaries, status, and prep notes.
              </p>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
