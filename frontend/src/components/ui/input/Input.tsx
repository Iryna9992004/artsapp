"use client";
import React, { useState } from "react";
import { InputProps } from "./types";
import { Eye, EyeOff } from "react-feather";

export default function Input({
  placeholder,
  type,
  errorMessage,
  register,
  disabled,
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
        className="bg-[#2F2F2F] border border-gray-600 px-5 py-3 placeholder-gray-300 rounded-full outline-none w-full caret-white focus:border-white text-white pr-14 disabled:opacity-50 disabled:cursor-not-allowed"
        {...register}
        disabled={disabled}
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

      {errorMessage ? (
        <div className="absolute top-full mt-1 z-1000 bg-red-500/90 border px-3 py-1 rounded-full border-red-700 w-full max-w-full text-white font-medium flex items-center justify-center text-sm text-center pointer-events-none">
          <span>{errorMessage}</span>
        </div>
      ) : null}
    </div>
  );
}
