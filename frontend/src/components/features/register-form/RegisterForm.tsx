"use client";
import Input from "@/components/ui/input/Input";
import React, { useState } from "react";

export default function RegisterForm() {
  const [full_name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form className="flex flex-col gap-2 min-w-80">
      <Input
        placeholder="Write you full name"
        value={full_name}
        setValue={setFullName}
      />
      <Input placeholder="Write your email" value={email} setValue={setEmail} />
      <Input
        placeholder="Write your password"
        value={password}
        setValue={setPassword}
        type="password"
      />
    </form>
  );
}
