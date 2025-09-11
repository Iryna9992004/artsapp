"use client";
import Input from "@/components/ui/input";
import TextArea from "@/components/ui/text-area/TextArea";
import React, { useState } from "react";

export default function Create() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  return (
    <div className="p-6 flex justify-center items-center w-full">
      <div className="w-100 max-w-full flex flex-col gap-5">
        <h1 className="text-3xl text-center font-bold text-white mb-10">
          Share your thoughts in post...
        </h1>
        <Input
          value={title}
          setValue={setTitle}
          placeholder="Write a title of post"
        />
        <TextArea
          value={description}
          setValue={setDescription}
          placeholder="Write a description of post"
        />
      </div>
    </div>
  );
}
