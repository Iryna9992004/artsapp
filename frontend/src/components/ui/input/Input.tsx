"use client";
import React, { useState } from "react";
import { InputProps } from "./types";
import { Eye, EyeOff } from "react-feather";

export default function Input({
  value,
  placeholder,
  setValue,
  type,
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="relative w-full">
      <input
        type={
          isPassword ? (showPassword ? "text" : "password") : (type ?? "text")
        }
        placeholder={placeholder}
        className="bg-[#2F2F2F] border border-gray-600 px-5 py-3 placeholder-gray-300 rounded-full outline-none w-full caret-white focus:border-white text-white pr-14"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white focus:outline-none"
        >
          {showPassword ? (
            <Eye className="text-gray-300 w-5" />
          ) : (
            <EyeOff className="text-gray-300 w-5" />
          )}
        </button>
      )}
    </div>
  );
}
