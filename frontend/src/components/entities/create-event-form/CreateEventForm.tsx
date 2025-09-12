'use client'
import Input from "@/components/ui/input";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { CreateEventFormInputs } from "./inputs";
import Button from "@/components/ui/button";
import TextArea from "@/components/ui/text-area/TextArea";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEventFormvalidationSchema } from "./schema";
import DragAndDrop from "@/components/ui/drag-and-drop";

export default function CreateEventForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitted },
  } = useForm<CreateEventFormInputs>({
    resolver: zodResolver(createEventFormvalidationSchema),
    defaultValues: {
      theme: "",
      title: "",
      description: "",
    },
  });

  const [file, setFile] = useState<File | null | undefined>(undefined);

  const submit = () => {
    if (!file) return;
    if (!isValid) return;
  };

  return (
    <div>
      <form
        className="w-full max-w-full flex flex-col gap-5"
        onSubmit={handleSubmit(submit)}
      >
        <h1 className="text-3xl text-center font-bold text-white mb-10">
          Share intersting events of your music life ...
        </h1>
        <DragAndDrop
          value={file as never}
          setValue={setFile}
          errorMessage={isSubmitted && !file ? "File is required" : null}
        />
        <Input
          register={register("theme")}
          placeholder="Write the theme of your event"
          errorMessage={errors.theme?.message}
        />
        <Input
          register={register("title")}
          placeholder="Write a title of title"
          errorMessage={errors.title?.message}
        />
        <TextArea
          register={register("description")}
          placeholder="Write a description of event"
          errorMessage={errors.description?.message}
        />

        <Button text="Publish Event" />
      </form>
    </div>
  );
}
