"use client";

import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  trend: string;
}

export function StatCard({ title, value, icon, trend }: StatCardProps) {
  const IconComponent = (LucideIcons as any)[icon];

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {IconComponent && <IconComponent className="h-4 w-4 text-muted-foreground" />}
      </div>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{trend}</p>
    </motion.div>
  );
}
