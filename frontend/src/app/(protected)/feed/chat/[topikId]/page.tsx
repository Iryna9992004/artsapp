"use client";
import SendForm from "@/components/features/send-form";
import { SendInputFormInputs } from "@/shared/validations/send-input/inputs";
import { sendFormValidationSchema } from "@/shared/validations/send-input/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";

export default function Page() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { isValid },
  } = useForm<SendInputFormInputs>({
    resolver: zodResolver(sendFormValidationSchema),
    defaultValues: {
      text: "",
    },
  });

  const submit = () => {
    if (!isValid) return;
  };

  return (
    <div className="p-2 max-h-[90vh] overflow-y-auto pb-20">
      <form onSubmit={handleSubmit(submit)}>
        <SendForm register={register("text")} value={getValues("text")} />
      </form>
    </div>
  );
}
