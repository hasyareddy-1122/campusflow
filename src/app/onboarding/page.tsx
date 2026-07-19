"use client";

import { useActionState } from "react";
import { updateProfile } from "@/actions/onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OnboardingPage() {
  const [state, action, pending] = useActionState(updateProfile, null);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Complete Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            <Input name="name" placeholder="Full Name" required />
            <Input name="reg_number" placeholder="Registration Number" required />
            <Input name="department" placeholder="Department" required />
            
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="branch">Branch</label>
              <select name="branch" id="branch" className="w-full h-10 px-3 rounded-md border border-input bg-background" required>
                {['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL'].map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="semester">Semester</label>
              <select name="semester" id="semester" className="w-full h-10 px-3 rounded-md border border-input bg-background" required>
                {['SEM1', 'SEM2', 'SEM3', 'SEM4', 'SEM5', 'SEM6', 'SEM7', 'SEM8'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            
            <Input name="phone_number" placeholder="Phone Number" />
            
            {state?.error && <div className="text-sm text-destructive">{JSON.stringify(state.error)}</div>}
            
            <Button className="w-full" disabled={pending}>
              {pending ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
