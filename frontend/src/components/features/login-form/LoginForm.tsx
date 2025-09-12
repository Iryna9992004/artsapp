"use client";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { LoginFormInputs } from "./inputs";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  return (
    <div className="flex flex-col gap-3">
      <form className="flex flex-col gap-6 min-w-80 max-w-full">
        <div className="flex flex-col gap-2">
          <Input
            placeholder="Write your email"
            register={register("email")}
            errorMessage={errors.email}
          />
          <Input
            placeholder="Write your password"
            register={register("password")}
            type="password"
            errorMessage={errors.password}
          />
        </div>

        <Button text="Login" />
      </form>
      <div className="text-center text-gray-300 font-bold">
        Don`t` have an account?{" "}
        <Link href="/register">
          <span className="text-purple-500 cursor-pointer">Sign Up</span>
        </Link>
      </div>
    </div>
  );
}
