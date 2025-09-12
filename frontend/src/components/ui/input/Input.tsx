"use client";
import React, { useState } from "react";
import { InputProps } from "./types";
import { Eye, EyeOff } from "react-feather";

export default function Input({
  placeholder,
  type,
  errorMessage,
  register,
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
        {...register}
      />
      {isPassword && (
        <button
          type="button"
          area-label="password-switch"
          name="password-switch"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white focus:outline-none cursor-pointer"
        >
          {showPassword ? (
            <Eye className="text-gray-300 w-5" />
          ) : (
            <EyeOff className="text-gray-300 w-5" />
          )}
        </button>
      )}

      <div className="bg-red-500 border border-red-700 text-white font-medium flex items-center justify-center">
        <span>{errorMessage as string}</span>
      </div>
    </div>
  );
}
