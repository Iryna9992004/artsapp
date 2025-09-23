"use client";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input/Input";
import Link from "next/link";
import React from "react";
import { RegisterFormInputs } from "./inputs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerFormvalidationSchema } from "./schema";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerFormvalidationSchema),
    defaultValues: {
      full_name: "",
      occupation: "",
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  const submit = async (data: RegisterFormInputs) => {
    if (!isValid) return;

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data }),
    });
    if (response.status === 200) {
      console.log(data);
      router.replace("/feed");
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <form
        className="flex flex-col gap-6 min-w-80 max-w-full"
        onSubmit={handleSubmit(submit)}
      >
        <div className="flex flex-col gap-2">
          <Input
            placeholder="Write your full name"
            register={register("full_name")}
            errorMessage={errors.full_name?.message}
          />
          <Input
            placeholder="Write your occupation"
            register={register("occupation")}
            errorMessage={errors.occupation?.message}
          />
          <Input
            placeholder="Write your email"
            register={register("email")}
            errorMessage={errors.email?.message}
          />
          <Input
            placeholder="Write your password"
            register={register("password")}
            errorMessage={errors.password?.message}
            type="password"
          />
        </div>

        <Button text="Register" type="submit" />
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
