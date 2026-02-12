"use client";
import MessagesList from "@/components/features/messages-list";
import SendForm from "@/components/features/send-form";
import { useFetchMessages } from "@/shared/hooks/messages/useFetchMessages";
import { useSendMessage } from "@/shared/hooks/messages/useSendMessage";
import { useUserId } from "@/shared/hooks/user/useUserId";
import { SendInputFormInputs } from "@/shared/validations/send-input/inputs";
import { sendFormValidationSchema } from "@/shared/validations/send-input/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import Loader from "@/components/ui/loader";

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
    watch,
    formState: { isValid },
  } = useForm<SendInputFormInputs>({
    resolver: zodResolver(sendFormValidationSchema),
    defaultValues: {
      text: "",
    },
  });

  const { messages, isLoading: isLoadingMessages } = useFetchMessages(topikId);
  const { isLoading: isSending, send } = useSendMessage(topikId, userId ?? 0);
  
  // Використовуємо watch для реактивного відстеження значення форми
  const textValue = watch("text");

  const submit = async () => {
    if (!isValid) return;
    const text = getValues("text");
    await send(text);
    setValue("text", "");
  };

  if (isLoadingMessages && messages.length === 0) {
    return (
      <div className="p-2 max-h-[90vh] flex items-center justify-center min-h-[400px]">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="p-2 max-h-[90vh] overflow-y-auto">
      <MessagesList data={messages} />
      <form onSubmit={handleSubmit(submit)}>
        <SendForm register={register("text")} value={textValue || ""} disabled={isSending} />
      </form>
    </div>
  );
}
