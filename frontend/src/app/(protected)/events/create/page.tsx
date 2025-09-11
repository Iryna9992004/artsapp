"use client";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import TextArea from "@/components/ui/text-area/TextArea";
import React, { useState } from "react";

export default function Create() {
  const [theme, setTheme] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  return (
    <div className="p-6 pt-20 flex justify-center items-center w-full h-[90vh] max-h-full overflow-y-auto">
      <form className="w-100 max-w-full flex flex-col gap-5">
        <h1 className="text-3xl text-center font-bold text-white mb-10">
          Share intersting events of your music life ...
        </h1>
        <Input
          value={theme}
          setValue={setTheme}
          placeholder="Write the theme of your event"
        />
        <Input
          value={title}
          setValue={setTitle}
          placeholder="Write a title of title"
        />
        <TextArea
          value={description}
          setValue={setDescription}
          placeholder="Write a description of event"
        />

        <Button text="Publish Event" />
      </form>
    </div>
  );
}
