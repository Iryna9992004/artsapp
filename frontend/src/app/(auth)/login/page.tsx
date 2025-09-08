import LoginForm from "@/components/features/login-form/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to ArtsApp",
};

export default function Login() {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="fixed bottom-0 h-[70vh] flex flex-col justify-between  items-center pb-10 w-full p-6 max-w-[500px]">
        <div className="flex flex-col text-white">
          <h2 className="text-3xl font-semibold">Login to</h2>
          <h1 className="text-6xl font-bold">ArtsApp</h1>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
