"use client";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import TextArea from "@/components/ui/text-area/TextArea";
import React from "react";
import { useForm } from "react-hook-form";
import { CreatePostFormInputs } from "./inputs";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPostFormValidationSchema } from "./schema";
import { useUserId } from "@/shared/hooks/user/useUserId";
import { useCreatePost } from "@/shared/hooks/posts/useCreatePost";

export default function CreatePostForm() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm<CreatePostFormInputs>({
    resolver: zodResolver(createPostFormValidationSchema),
    mode: "onChange",
    defaultValues: {
      theme: "",
      title: "",
      description: "",
    },
  });

  const { userId } = useUserId();
  const { create, isLoading } = useCreatePost(userId);

  const submit = async () => {
    if (!isValid) return;
    const title = getValues("title");
    const description = getValues("description");
    await create(title, description);
  };

  return (
    <form
      className="w-100 max-w-full flex flex-col gap-5"
      onSubmit={handleSubmit(submit)}
    >
      <h1 className="text-3xl text-center font-bold text-white mb-10">
        Share your thoughts in post...
      </h1>
      <Input
        register={register("title")}
        placeholder="Write a title of post"
        errorMessage={errors.title?.message}
        disabled={isLoading}
      />
      <TextArea
        register={register("description")}
        placeholder="Write a description of post"
        errorMessage={errors.description?.message}
        disabled={isLoading}
      />

      <Button text={isLoading ? "Publishing..." : "Publish Post"} type="submit" disabled={isLoading} />
    </form>
  );
}
