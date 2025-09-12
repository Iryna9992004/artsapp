import Input from "@/components/ui/input";
import React from "react";
import { useForm } from "react-hook-form";
import { CreateEventFormInputs } from "./inputs";
import Button from "@/components/ui/button";
import TextArea from "@/components/ui/text-area/TextArea";

export default function CreateEventForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateEventFormInputs>();
  return (
    <div>
      <form className="w-100 max-w-full flex flex-col gap-5">
        <h1 className="text-3xl text-center font-bold text-white mb-10">
          Share intersting events of your music life ...
        </h1>
        <Input
          register={register('theme')}
          placeholder="Write the theme of your event"
          errorMessage={errors.theme?.message}
        />
        <Input
          register={register('title')}
          placeholder="Write a title of title"
          errorMessage={errors.title?.message}
        />
        <TextArea
          register={register('description')}
          placeholder="Write a description of event"
          errorMessage={errors.description?.message}
        />

        <Button text="Publish Event" />
      </form>
    </div>
  );
}
