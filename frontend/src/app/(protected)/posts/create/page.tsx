"use client";
import React from "react";
import CreatePostForm from "@/components/features/create-post-form";

export default function Create() {
  return (
    <div className="p-6 pt-20 flex justify-center items-center w-full h-[90vh] max-h-full overflow-y-auto">
      <CreatePostForm />
    </div>
  );
}
