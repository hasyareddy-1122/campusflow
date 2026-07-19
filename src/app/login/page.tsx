"use client";

import { useActionState } from "react";
import { login } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, null);

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 bg-primary items-center justify-center p-12 text-primary-foreground">
         <div className="max-w-md space-y-6">
            <h1 className="text-5xl font-bold tracking-tighter">Welcome back to CampusFlow</h1>
            <p className="text-xl opacity-90">Your intelligent academic assistant, redesigned for excellence.</p>
         </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm space-y-6"
        >
            <h2 className="text-2xl font-semibold">Sign In</h2>
            <form action={action} className="space-y-4">
                <Input name="email" type="email" placeholder="Email address" className="h-11 rounded-lg bg-muted/50" required />
                <Input name="password" type="password" placeholder="Password" className="h-11 rounded-lg bg-muted/50" required />
                {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
                
                <div className="text-right text-sm">
                    <Link href="/forgot-password" className="text-muted-foreground hover:text-primary transition-colors">Forgot password?</Link>
                </div>
                
                <Button className="w-full h-11 rounded-lg text-base" disabled={pending}>
                    {pending ? "Signing in..." : "Sign In"}
                </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground">
                Don't have an account? <Link href="/signup" className="text-primary font-medium hover:underline">Sign Up</Link>
            </p>
        </motion.div>
      </div>
    </div>
  );
}
