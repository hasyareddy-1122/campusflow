"use client";

import { useActionState } from "react";
import { forgotPassword } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState(forgotPassword, null);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          {state?.success ? (
            <p className="text-sm text-green-600">Check your email for reset instructions.</p>
          ) : (
            <form action={action} className="space-y-4">
              <Input name="email" type="email" placeholder="Email" required />
              {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
              <Button className="w-full" disabled={pending}>
                {pending ? "Sending..." : "Send Reset Link"}
              </Button>
              <p className="text-center text-sm">
                <Link href="/login" className="underline">Back to Login</Link>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
