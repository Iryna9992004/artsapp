"use client";
import React from "react";
import { Send } from "react-feather";
import { SendFormProps } from "./types";
import Loader from "@/components/ui/loader";

export default function SendForm({ register, value, disabled }: SendFormProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 w-full flex items-center justify-center px-4">
      <div className="w-200 max-w-full  bg-black/80 py-4 flex items-center gap-3">
        <input
          className="rounded-full py-3 px-6 flex-1 bg-gray-800 border border-gray-400 placeholder-white text-white outline-none focus:border-white disabled:opacity-50"
          placeholder="Write your message ..."
          {...register}
          disabled={disabled}
        />
        <button
          disabled={!value || disabled}
          className="flex items-center justify-center px-4 py-3 text-white bg-blue-700 rounded-2xl cursor-pointer hover:bg-blue-900 transition duration-200 disabled:bg-blue-800 disabled:cursor-not-allowed"
        >
          {disabled ? <Loader size="sm" /> : <Send className="w-5" />}
        </button>
      </div>
    </div>
  );
}
