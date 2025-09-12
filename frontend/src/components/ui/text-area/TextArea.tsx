"use client";
import React from "react";

import { TextAreaProps } from "./types";

export default function TextArea({
  register,
  placeholder,
  errorMessage,
}: TextAreaProps) {
  return (
    <div className="relative w-full">
      <textarea
        placeholder={placeholder}
        className="bg-[#2F2F2F] border border-gray-600 px-5 py-3 placeholder-gray-300 rounded-2xl outline-none w-full caret-white focus:border-white text-white pr-14 min-h-30"
        {...register}
      />
      {errorMessage ? (
        <div className="absolute top-full mt-1 z-1000 bg-red-500/90 border px-3 py-1 rounded-full border-red-700 max-w-full text-white font-medium flex items-center justify-center text-sm text-center pointer-events-none">
          <span>{errorMessage}</span>
        </div>
      ) : null}
    </div>
  );
}
