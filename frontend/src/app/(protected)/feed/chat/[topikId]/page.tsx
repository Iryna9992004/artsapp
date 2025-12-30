"use client";
import MessagesList from "@/components/features/messages-list";
import SendForm from "@/components/features/send-form";
import { useFetchMessages } from "@/shared/hooks/messages/useFetchMessages";
import { useReadMessage } from "@/shared/hooks/messages/useReadMessage";
import { useSendMessage } from "@/shared/hooks/messages/useSendMessage";
import { useUserId } from "@/shared/hooks/user/useUserId";
import { SendInputFormInputs } from "@/shared/validations/send-input/inputs";
import { sendFormValidationSchema } from "@/shared/validations/send-input/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

export const dynamic = "force-dynamic";

export default function Page() {
  const params = useParams<{ topikId: string }>();
  const topikId = Number(params.topikId);

  const { userId } = useUserId();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { isValid },
  } = useForm<SendInputFormInputs>({
    resolver: zodResolver(sendFormValidationSchema),
    defaultValues: {
      text: "",
    },
  });

  const { messages, isLoading: isLoadingMessages } = useFetchMessages(topikId);
  const { isLoading: isSending, send } = useSendMessage(topikId, userId ?? 0);
  const { isLoading: isReading, read } = useReadMessage(userId ?? 0);

  const sendMessage1 = async () => {
    console.log("-=--", topikId, userId);
    console.log("here");
    await send("dscscdsdc csdsdcsdccsd csdscd");
    console.log("messages", messages);
  };

  const submit = async () => {
    if (!isValid) return;
    const text = getValues("text");
    await send(text);
    setValue("text", "");
  };

  return (
    <div className="p-2 max-h-[90vh] overflow-y-auto">
      <MessagesList data={messages} />
      <form onSubmit={handleSubmit(submit)}>
        <SendForm register={register("text")} value={getValues("text")} />
      </form>
    </div>
  );
}
