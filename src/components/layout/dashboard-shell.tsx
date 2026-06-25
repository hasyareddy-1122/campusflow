"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Sparkles, LayoutDashboard, CalendarDays, MessageSquare, Settings, Sun, Moon, X, Search, Bell, User, ListTodo, CheckCircle, BrainCircuit, FileText, Briefcase, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Calendar", href: "/calendar", icon: CalendarDays },
  { label: "Tasks", href: "/tasks", icon: ListTodo },
  { label: "Attendance", href: "/attendance", icon: CheckCircle },
  { label: "Study Buddy", href: "/study-buddy", icon: BrainCircuit },
  { label: "Notice Summarizer", href: "/notices", icon: FileText },
  { label: "Placement Tracker", href: "/placement", icon: Briefcase },
  { label: "Profile", href: "/profile", icon: UserCircle },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  // Close mobile sidebar on navigation
  React.useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden w-72 flex-col border-r bg-card/50 px-4 py-5 md:flex">
          <div className="flex items-center gap-2 px-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight">CampusFlow AI</p>
              <p className="text-xs text-muted-foreground">Foundation shell</p>
            </div>
          </div>
          <Separator className="my-5" />
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto px-2">
            <p className="text-xs text-center text-muted-foreground">© 2026 CampusFlow AI</p>
          </div>
        </aside>

        {/* Mobile Sidebar (Drawer) with Framer Motion */}
        <AnimatePresence>
          {isMobileOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileOpen(false)}
                className="fixed inset-0 z-40 bg-black md:hidden"
              />
              {/* Drawer Content */}
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed bottom-0 top-0 left-0 z-50 flex w-72 flex-col border-r bg-background px-4 py-5 md:hidden shadow-xl"
              >
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold tracking-tight">CampusFlow AI</p>
                      <p className="text-xs text-muted-foreground">Foundation shell</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileOpen(false)}
                    className="rounded-lg"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <Separator className="my-5" />
                <nav className="flex-1 space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
                <div className="mt-auto px-2">
                  <p className="text-xs text-center text-muted-foreground">© 2026 CampusFlow AI</p>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileOpen(true)}
                  className="md:hidden rounded-lg"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-base font-semibold tracking-tight">CampusFlow AI</h1>
                </div>
              </div>

              {/* Added Search Bar */}
              <div className="hidden flex-1 max-w-sm mx-4 md:block">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search tasks, deadlines..." className="pl-9 rounded-lg" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="rounded-lg">
                  <Bell className="h-5 w-5" />
                </Button>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleTheme}
                  className="hidden sm:flex items-center gap-2 rounded-lg transition-all duration-200"
                >
                  {theme === "light" ? (
                    <Moon className="h-4 w-4 text-slate-700" />
                  ) : (
                    <Sun className="h-4 w-4 text-amber-400" />
                  )}
                </Button>
              </div>
            </div>
          </header>
          <main className="flex-1 bg-muted/20 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
