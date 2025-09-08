import RegisterForm from "@/components/features/register-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  description: "Register to ArtsApp",
};

export default function Register() {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="fixed bottom-0 h-[75vh] flex flex-col justify-between  items-center pb-10 w-full p-6 max-w-[500px]">
        <div className="flex flex-col text-white">
          <h2 className="text-3xl font-semibold">Register to</h2>
          <h1 className="text-6xl font-bold">ArtsApp</h1>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
