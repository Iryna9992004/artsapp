import CreateTopicForm from "@/components/features/create-topic-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Topic",
  description: "On this page you can create your own topic",
};

export default function Create() {
  return (
    <div className="p-6 pt-20 flex justify-center items-center w-full h-[90vh] max-h-full overflow-y-auto">
      <CreateTopicForm />
    </div>
  );
}
