"use client";
import CreateTopicForm from "@/components/features/create-topic-form";

export default function Create() {
  return (
    <div className="p-6 pt-20 flex justify-center items-center w-full h-[90vh] max-h-full overflow-y-auto">
      <CreateTopicForm />
    </div>
  );
}
