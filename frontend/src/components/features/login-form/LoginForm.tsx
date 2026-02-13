"use client";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { LoginFormInputs } from "./inputs";
import { loginFormvalidationSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useState } from "react";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginFormvalidationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (data: LoginFormInputs) => {
    if (!isValid) return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data }),
      });
      const result = await response.json();
      if (response.ok) {
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
        router.replace("/feed");
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
            placeholder="Write your email"
            register={register("email")}
            errorMessage={errors.email?.message}
            disabled={isLoading}
          />
          <Input
            placeholder="Write your password"
            register={register("password")}
            type="password"
            errorMessage={errors.password?.message}
            disabled={isLoading}
          />
        </div>

        <Button text={isLoading ? "Logging in..." : "Login"} type="submit" disabled={isLoading} />
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
