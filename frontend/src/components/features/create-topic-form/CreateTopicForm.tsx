import Button from "@/components/ui/button";
import TextArea from "@/components/ui/text-area/TextArea";
import React from "react";
import { useForm } from "react-hook-form";
import { CreateTopicFormInputs } from "./inputs";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTopicFormvalidationSchema } from "./schema";

export default function CreateTopicForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CreateTopicFormInputs>({
    mode: "onChange",
    resolver: zodResolver(createTopicFormvalidationSchema),
    defaultValues: {
      topic: "",
    },
  });

  const submit = () => {
    if(!isValid) return;
  };

  return (
    <form
      className="w-100 max-w-full flex flex-col gap-5"
      onSubmit={handleSubmit(submit)}
    >
      <h1 className="text-3xl text-center font-bold text-white mb-10">
        Write your own topic ...
      </h1>
      <TextArea
        register={register("topic")}
        placeholder="Write a topic"
        errorMessage={errors.topic?.message}
      />
      <Button text="Publish Topic" />
    </form>
  );
}
