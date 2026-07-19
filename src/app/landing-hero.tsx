"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Zap, Target, BrainCircuit } from "lucide-react";
import { motion } from "framer-motion";

export function LandingHero() {
  return (
    <section className="pt-32 pb-20 container mx-auto px-6 text-center space-y-8">
        <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-6xl md:text-8xl font-bold tracking-tighter bg-gradient-to-br from-white via-white/80 to-white/40 bg-clip-text text-transparent"
        >
          Master your academic life.
        </motion.h1>
        <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }} 
            className="text-xl text-neutral-400 max-w-2xl mx-auto"
        >
          CampusFlow AI brings order to your hectic student life with smart automation, intelligent planning, and powerful insights.
        </motion.p>
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
        >
          <Link href="/signup"><Button size="lg" className="h-14 px-10 rounded-full text-lg shadow-2xl shadow-primary/20">Get Started <ArrowRight className="ml-2" /></Button></Link>
        </motion.div>
    </section>
  );
}
