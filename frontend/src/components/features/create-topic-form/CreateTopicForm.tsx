"use client";
import Button from "@/components/ui/button";
import TextArea from "@/components/ui/text-area/TextArea";
import React from "react";
import { useForm } from "react-hook-form";
import { CreateTopicFormInputs } from "./inputs";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTopicFormvalidationSchema } from "./schema";
import { useCreateTopic } from "@/shared/hooks/topic/useCreateTopic";
import { useUserId } from "@/shared/hooks/user/useUserId";

export default function CreateTopicForm() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm<CreateTopicFormInputs>({
    resolver: zodResolver(createTopicFormvalidationSchema),
    defaultValues: {
      topic: "",
    },
  });
  const { userId } = useUserId();
  const { createTopic } = useCreateTopic(userId);

  const submit = async () => {
    if (!isValid) return;

    const topic = getValues("topic");
    await createTopic(topic);
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
