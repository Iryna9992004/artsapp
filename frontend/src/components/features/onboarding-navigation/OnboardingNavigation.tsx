'use client'
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";
import React from "react";

export default function OnboardingNavigation() {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-4 w-full">
      <Button text="Login" onClick={() => router.push("/login")} />
      <Button
        text="Register"
        variant="secondary"
        onClick={() => router.push("/register")}
      />
    </div>
  );
}
