import Button from "@/components/ui/button";
import DragAndDrop from "@/components/ui/drag-and-drop";
import Input from "@/components/ui/input";
import TextArea from "@/components/ui/text-area/TextArea";
import React from "react";
import { useForm } from "react-hook-form";
import { CreatePostFormInputs } from "./inputs";

export default function CreatePostForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePostFormInputs>();
  return (
    <form className="w-100 max-w-full flex flex-col gap-5">
      <h1 className="text-3xl text-center font-bold text-white mb-10">
        Share your thoughts in post...
      </h1>
      <DragAndDrop />
      <Input
        register={register("title")}
        placeholder="Write a title of post"
        errorMessage={errors.title?.message}
      />
      <TextArea
        register={register("description")}
        placeholder="Write a description of post"
        errorMessage={errors.description?.message}
      />

      <Button text="Publish Post" />
    </form>
  );
}
