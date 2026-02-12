"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { searchInputValidationSchema } from "./schema";
import { SearchInputFormInputs } from "./inputs";
import { SearchInputProps } from "./types";

export default function SearchInput({ setValue }: SearchInputProps) {
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    watch,
    formState: { isValid },
  } = useForm<SearchInputFormInputs>({
    resolver: zodResolver(searchInputValidationSchema),
    defaultValues: {
      text: "",
    },
  });

  const searchText = watch("text");
  const hasText = searchText && searchText.length > 0;

  const submit = () => {
    if (!isValid) return;
    const value = getValues("text");
    setValue(value);
  };

  const clearSearch = () => {
    reset({ text: "" });
    setValue(undefined);
  };

  return (
    <div className="sticky top-0 left-0 right-0 py-2 px-6 w-full flex justify-center bg-black/80 z-1000">
      <form
        className="flex rounded-md border-2 border-blue-500 overflow-hidden w-full"
        onSubmit={handleSubmit(submit)}
      >
        <div className="flex-1 relative">
          <input
            {...register("text")}
            placeholder="Search Something..."
            className="w-full outline-none bg-gray-600/50 text-white px-4 py-3 pr-10 hover:bg-gray-600/20 focus:bg-gray-600/20 transtion duration-300 text-md"
          />
          {hasText && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-gray-500/50 transition duration-150 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="16px"
                height="16px"
                className="fill-white"
              >
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          )}
        </div>
        <button
          type="submit"
          aria-label="search"
          name="search"
          disabled={!hasText}
          className="flex items-center justify-center bg-[#007bff] px-5 cursor-pointer hover:bg-blue-700 transition duration-150 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 192.904 192.904"
            width="16px"
            className="fill-white"
          >
            <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
          </svg>
        </button>
      </form>
    </div>
  );
}
