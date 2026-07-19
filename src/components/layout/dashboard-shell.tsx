"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  LayoutDashboard,
  CalendarDays,
  Bell,
  User,
  ListTodo,
  CheckCircle,
  BrainCircuit,
  FileText,
  Briefcase,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { logout } from "@/actions/auth";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Calendar", href: "/dashboard/calendar", icon: CalendarDays },
  { label: "Tasks", href: "/dashboard/tasks", icon: ListTodo },
  { label: "Attendance", href: "/dashboard/attendance", icon: CheckCircle },
  { label: "Study Buddy", href: "/dashboard/study-buddy", icon: BrainCircuit },
  { label: "Notice Summarizer", href: "/dashboard/notices", icon: FileText },
  { label: "Placement Tracker", href: "/dashboard/placement", icon: Briefcase },
];

export function DashboardShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user?: any;
}) {
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();

  const [isCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans antialiased">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        className="fixed inset-y-0 left-0 z-30 hidden border-r border-border/40 bg-card/50 backdrop-blur-xl md:flex flex-col">
        {/* Logo */}
        <div className="flex items-center h-16 px-5 gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-6 w-6" strokeWidth={2.2} />
          </div>

          {!isCollapsed && (
            <span className="text-xl font-bold tracking-tight">CampusFlow</span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}>
                <Icon className="h-6 w-6 shrink-0" strokeWidth={2.2} />
                {!isCollapsed && (
                  <span className="text-[15px]">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <div
        className={cn(
          "flex-1 transition-all duration-300",
          isCollapsed ? "md:pl-20" : "md:pl-72",
        )}>
        {/* Header */}
        <header className="sticky top-0 z-20 h-16 border-b border-border/40 bg-background/80 backdrop-blur-xl flex items-center justify-end px-6">
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              onClick={toggleTheme}
              className="h-10 w-10 rounded-full border border-border/50 bg-background/50 hover:bg-muted p-0 flex items-center justify-center">
              {mounted &&
                (resolvedTheme === "dark" ? (
                  <Sun className="h-6 w-6 text-amber-400" strokeWidth={2.2} />
                ) : (
                  <Moon className="h-6 w-6 text-sky-400" strokeWidth={2.2} />
                ))}
            </Button>

            {/* Notification */}
            <Button
              variant="ghost"
              className="h-10 w-10 rounded-full p-0 flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90">
              <Bell className="h-6 w-6" strokeWidth={2.2} />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-10 w-10 rounded-full p-0 flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90">
                  <User className="h-6 w-6" strokeWidth={2.2} />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-48 mt-2 rounded-xl border-border bg-card shadow-lg">
                <DropdownMenuLabel className="p-4">
                  <p className="font-semibold">
                    {user?.user_metadata?.name || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-border/40" />

                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">Profile</Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">Settings</Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-border/40" />

                <DropdownMenuItem
                  onClick={() => logout()}
                  className="text-destructive">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
