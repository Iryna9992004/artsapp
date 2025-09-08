import React from "react";
import { ButtonProps } from "./types";

export default function Button({
  text,
  variant = "primary",
  type,
  onClick,
}: ButtonProps) {
  return (
    <button
      type={type as never}
      className={`px-5 py-3 ${variant === "primary" ? "bg-linear-to-bl from-violet-500 to-fuchsia-500 hover:shadow-lg hover:shadow-violet-900" : "bg-black border border-gray-400 hover:bg-[#141414] hover:shadow-lg hover:shadow-gray-900"} rounded-full text-white font-bold cursor-pointer`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
