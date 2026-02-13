"use client";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input/Input";
import Link from "next/link";
import React, { useState } from "react";
import { RegisterFormInputs } from "./inputs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerFormvalidationSchema } from "./schema";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

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
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (data: RegisterFormInputs) => {
    if (!isValid) return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data }),
      });
      const result = await response.json();
      if (response.status === 200) {
        // Backend returns refreshToken and accessToken, not userSessionId
        if (result.data?.refreshToken) {
          localStorage.setItem("refreshToken", result.data.refreshToken);
        }
        if (result.data?.accessToken) {
          localStorage.setItem("accessToken", result.data.accessToken);
        }
        if (result.data?.user?.id) {
          localStorage.setItem("user_id", result.data.user.id.toString());
        }
        router.replace("/login");
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsLoading(false);
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
            disabled={isLoading}
          />
          <Input
            placeholder="Write your occupation"
            register={register("occupation")}
            errorMessage={errors.occupation?.message}
            disabled={isLoading}
          />
          <Input
            placeholder="Write your email"
            register={register("email")}
            errorMessage={errors.email?.message}
            disabled={isLoading}
          />
          <Input
            placeholder="Write your password"
            register={register("password")}
            errorMessage={errors.password?.message}
            type="password"
            disabled={isLoading}
          />
        </div>

        <Button text={isLoading ? "Registering..." : "Register"} type="submit" disabled={isLoading} />
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
