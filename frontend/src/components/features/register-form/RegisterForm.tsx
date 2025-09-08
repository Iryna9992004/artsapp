"use client";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/input/Input";
import Link from "next/link";
import React, { useState } from "react";

export default function RegisterForm() {
  const [full_name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex flex-col gap-3">
      <form className="flex flex-col gap-6 min-w-80 max-w-full">
        <div className="flex flex-col gap-2">
          <Input
            placeholder="Write you full name"
            value={full_name}
            setValue={setFullName}
          />
          <Input
            placeholder="Write your email"
            value={email}
            setValue={setEmail}
          />
          <Input
            placeholder="Write your password"
            value={password}
            setValue={setPassword}
            type="password"
          />
        </div>

        <Button text="Register" />
      </form>
      <div className="text-center text-gray-300 font-bold">
        Already have an account?{" "}
        <Link href="/login">
          <span className="text-purple-500 cursor-pointer">Sign In</span>
        </Link>
      </div>
    </div>
  );
}
