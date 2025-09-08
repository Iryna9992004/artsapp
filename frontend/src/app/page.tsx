import RegisterForm from "@/components/features/register-form";

export default function Home() {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="">
        <div className="flex flex-col text-white">
          <h2 className="text-3xl font-semibold">Welcome to</h2>
          <h1 className="text-6xl font-bold">ArtsApp</h1>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
}
