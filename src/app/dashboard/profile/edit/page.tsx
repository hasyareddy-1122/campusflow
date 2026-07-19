"use client";

import { useActionState } from "react";
import { updateProfile } from "@/actions/onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const [state, action, pending] = useActionState(updateProfile, null);
  const router = useRouter();

  return (
    <div className="container py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            <Input name="name" placeholder="Full Name" />
            <Input name="reg_number" placeholder="Registration Number" />
            <Input name="department" placeholder="Department" />
            <Input name="branch" placeholder="Branch (CSE, ECE, EEE, MECH, CIVIL)" />
            <Input name="semester" placeholder="Semester (SEM1, SEM2, etc.)" />
            <Input name="phone_number" placeholder="Phone Number" />
            <Input name="bio" placeholder="Bio" />
            <Input name="cgpa" type="number" step="0.01" placeholder="CGPA" />
            <Input name="github_url" placeholder="GitHub URL" />
            <Input name="linkedin_url" placeholder="LinkedIn URL" />
            <Input name="resume_url" placeholder="Resume URL" />
            
            {state?.error && (
              <div className="text-sm text-destructive">
                {typeof state.error === 'string' ? state.error : JSON.stringify(state.error)}
              </div>
            )}
            
            <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={pending}>
                  {pending ? "Saving..." : "Save Changes"}
                </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
