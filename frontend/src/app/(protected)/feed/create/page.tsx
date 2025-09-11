"use client";
import Button from "@/components/ui/button/Button";
import TextArea from "@/components/ui/text-area/TextArea";
import React, { useState } from "react";

export default function Create() {
  const [topic, setTopik] = useState("");
  return (
    <div className="p-6 pt-20 flex justify-center items-center w-full h-[90vh] max-h-full overflow-y-auto">
      <form className="w-100 max-w-full flex flex-col gap-5">
        <h1 className="text-3xl text-center font-bold text-white mb-10">
          Write your own topic ...
        </h1>
        <TextArea
          value={topic}
          setValue={setTopik}
          placeholder="Write a topic"
        />
        <Button text="Publish Topic" />
      </form>
    </div>
  );
}
