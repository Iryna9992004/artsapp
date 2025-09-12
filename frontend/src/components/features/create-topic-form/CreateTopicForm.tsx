import Button from "@/components/ui/button";
import TextArea from "@/components/ui/text-area/TextArea";
import React from "react";
import { useForm } from "react-hook-form";
import { CreateTopicFormInputs } from "./inputs";

export default function CreateTopicForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTopicFormInputs>();
  return (
    <form className="w-100 max-w-full flex flex-col gap-5">
      <h1 className="text-3xl text-center font-bold text-white mb-10">
        Write your own topic ...
      </h1>
      <TextArea
        register={register("topic")}
        placeholder="Write a topic"
        errorMessage={errors.topic}
      />
      <Button text="Publish Topic" />
    </form>
  );
}
