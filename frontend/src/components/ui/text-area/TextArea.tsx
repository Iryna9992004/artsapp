"use client";
import React from "react";

import { TextAreaProps } from "./types";

export default function TextArea({
  value,
  placeholder,
  setValue,
}: TextAreaProps) {
  return (
    <div className="relative w-full">
      <textarea
        placeholder={placeholder}
        className="bg-[#2F2F2F] border border-gray-600 px-5 py-3 placeholder-gray-300 rounded-2xl outline-none w-full caret-white focus:border-white text-white pr-14 min-h-30"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
