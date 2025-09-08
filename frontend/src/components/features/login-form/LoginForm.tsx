'use client'
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/input";
import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div>
      <form className="flex flex-col gap-6 min-w-80 max-w-full">
        <div className="flex flex-col gap-2">
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

        <Button text="Login" />
      </form>
    </div>
  );
}
