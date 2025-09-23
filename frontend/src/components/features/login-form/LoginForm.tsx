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

  const submit = async (data: LoginFormInputs) => {
    if (!isValid) return;
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data }),
    });
    const result = await response.json();
    if (response.ok) {
      localStorage.setItem("userSessionId", result.data.userSessionId);
      router.replace("/feed");
    } else {
      toast.error(result.message);
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
          />
          <Input
            placeholder="Write your password"
            register={register("password")}
            type="password"
            errorMessage={errors.password?.message}
          />
        </div>

        <Button text="Login" type="submit" />
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
