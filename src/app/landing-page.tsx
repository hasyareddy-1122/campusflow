import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Zap, Target, BrainCircuit } from "lucide-react";
import { LandingHero } from "./landing-hero";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Navbar */}
      <nav className="fixed w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl"><Sparkles className="text-primary" /> CampusFlow</div>
          <div className="flex gap-4">
            <Link href="/login"><Button variant="ghost">Login</Button></Link>
            <Link href="/signup"><Button>Sign Up</Button></Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <LandingHero />

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-20 grid md:grid-cols-3 gap-8">
        {[
            { title: "Smart Tasks", icon: Zap, desc: "AI-powered task prioritization" },
            { title: "Placement Tracker", icon: Target, desc: "Manage applications with ease" },
            { title: "Notice AI", icon: BrainCircuit, desc: "Summarize notices instantly" }
        ].map((f, i) => (
            <div key={i} className="p-8 rounded-3xl border border-white/10 bg-neutral-900/50 backdrop-blur-sm space-y-4">
                <f.icon className="h-10 w-10 text-primary" />
                <h3 className="text-xl font-bold">{f.title}</h3>
                <p className="text-neutral-400">{f.desc}</p>
            </div>
        ))}
      </section>
    </div>
  );
}
