import React from "react";
import { ButtonProps } from "./types";

export default function Button({
  text,
  variant = "primary",
  type,
  onClick,
  disabled,
}: ButtonProps) {
  const baseClasses =
    "px-6 py-3 rounded-full text-white font-bold cursor-pointer transition-all duration-300 ease-out transform relative overflow-hidden group active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

  const primaryClasses =
    "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 hover:-translate-y-1";

  const secondaryClasses =
    "bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600 hover:from-gray-700 hover:to-gray-800 hover:border-gray-500 hover:shadow-2xl hover:shadow-gray-900/50 hover:scale-105 hover:-translate-y-1";

  return (
    <button
      disabled={disabled}
      type={type as never}
      className={`${baseClasses} ${variant === "primary" ? primaryClasses : secondaryClasses}`}
      onClick={onClick}
    >
      <div className="absolute inset-0 -top-1 -left-1 bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-45 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out"></div>
      {variant === "primary" && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-400 to-purple-500 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300"></div>
      )}

      <span className="relative z-10 drop-shadow-sm">{text}</span>

      <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-active:scale-100 transition-transform duration-150 ease-out"></div>
    </button>
  );
}
