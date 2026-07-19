"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();

  // Pages that should NOT be wrapped in the Dashboard Shell (marketing landing + auth screens)
  const noSidebarPaths = [
    "/", // Root landing page
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/onboarding",
  ];

  const shouldShowSidebar = !noSidebarPaths.some((path) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(path);
  });

  if (shouldShowSidebar) {
    return <DashboardShell>{children}</DashboardShell>;
  }

  // Otherwise, render clean raw children (for public landing page, login, signup, onboarding, etc.)
  return <>{children}</>;
}
