import React from "react";
import { EventProps } from "./types";
import Image from "next/image";

export default function Event({
  img_source,
  title,
  description,
  author,
  date,
}: EventProps) {
  return (
    <div className="flex flex-col max-h-fit w-full max-w-80 rounded-xl bg-violet-300/20 hover:bg-violet-300/10 transition duration-150 cursor-pointer">
      <Image
        src={
          img_source ??
          "https://png.pngtree.com/thumb_back/fh260/background/20240522/pngtree-abstract-cloudy-background-beautiful-natural-streaks-of-sky-and-clouds-red-image_15684333.jpg"
        }
        alt="event image"
        width={300}
        height={300}
        className="h-55 bg-blue-500 w-full rounded-tl-xl rounded-tr-xl"
      />
      <div className="p-4 w-full flex-1 flex flex-col gap-4 justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-purple-300">{date}</span>
          <h2 className="font-bold text-xl text-white">{title}</h2>
          <span className="text-gray-400 text-sm">{description}</span>
        </div>

        <div className="flex flex-col hap-2">
          <span className="text-sm text-white">{author}</span>
          <span className="text-xs text-gray-400">{date}</span>
        </div>
      </div>
    </div>
  );
}
