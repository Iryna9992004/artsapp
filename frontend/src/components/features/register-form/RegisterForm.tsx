"use client";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input/Input";
import Link from "next/link";
import React from "react";
import { RegisterFormInputs } from "./inputs";
import { useForm } from "react-hook-form";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>();

  return (
    <div className="flex flex-col gap-3">
      <form className="flex flex-col gap-6 min-w-80 max-w-full">
        <div className="flex flex-col gap-2">
          <Input
            placeholder="Write your full name"
            register={register("full_name")}
            errorMessage={errors.full_name}
          />
          <Input
            placeholder="Write your occupation"
            register={register("occupation")}
            errorMessage={errors.occupation}
          />
          <Input
            placeholder="Write your email"
            register={register("email")}
            errorMessage={errors.email}
          />
          <Input
            placeholder="Write your password"
            register={register("password")}
            errorMessage={errors.password}
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
