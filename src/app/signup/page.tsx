"use client";

import { useActionState } from "react";
import { signup } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import Link from "next/link";

export default function SignupPage() {
  const [state, action, pending] = useActionState(signup, null);

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 bg-secondary items-center justify-center p-12 text-secondary-foreground">
         <div className="max-w-md space-y-6">
            <h1 className="text-5xl font-bold tracking-tighter">Start your journey today</h1>
            <p className="text-xl opacity-90">Join thousands of students optimizing their academic life with CampusFlow AI.</p>
         </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm space-y-6"
        >
            <h2 className="text-2xl font-semibold">Create Account</h2>
            <form action={action} className="space-y-4">
                <Input name="name" placeholder="Full Name" className="h-11 rounded-lg bg-muted/50" required />
                <Input name="email" type="email" placeholder="Email address" className="h-11 rounded-lg bg-muted/50" required />
                <Input name="password" type="password" placeholder="Password" className="h-11 rounded-lg bg-muted/50" required />
                <Input name="confirmPassword" type="password" placeholder="Confirm Password" className="h-11 rounded-lg bg-muted/50" required />
                
                {state?.error && (
                    <div className="text-sm text-destructive">
                        {typeof state.error === 'string' ? state.error : Object.values(state.error).flat().join(', ')}
                    </div>
                )}
                
                <Button className="w-full h-11 rounded-lg text-base" disabled={pending}>
                    {pending ? "Creating..." : "Sign Up"}
                </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground">
                Already have an account? <Link href="/login" className="text-primary font-medium hover:underline">Sign In</Link>
            </p>
        </motion.div>
      </div>
    </div>
  );
}
