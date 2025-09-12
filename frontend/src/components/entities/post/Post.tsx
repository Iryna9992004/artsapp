import Link from "next/link";
import React from "react";
import { Music } from "react-feather";
import { PostProps } from "./types";
import Image from "next/image";

export default function Post({
  date,
  title,
  description,
  author,
  author_occupation,
  img_source,
}: PostProps) {
  return (
    <Link href={`/posts/info/1?title=How to use optimization`}>
      <div className="flex flex-col lg:flex-row items-start gap-4 p-4 bg-blue-800/40 hover:bg-blue-900/40 transition duration-150 rounded-2xl cursor-pointer">
        <Image
          src={img_source}
          alt="post_img"
          className="h-50 w-200 max-w-full bg-blue-500 rounded-xl"
        />
        <div>
          <div className="flex flex-col gap-4 h-full">
            <span className="text-sm text-gray-400">{date}</span>
            <h2 className="text-white text-xl font-bold">{title}</h2>

            <p className="text-md text-gray-400">{description}</p>

            <div className="h-[1px] bg-gray-300 w-full" />

            <div className="flex items-center gap-3">
              <div className="p-4 bg-blue-500 flex text-white items-center justify-center rounded-full">
                <Music />
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-lg font-semibold text-white">
                  {author}
                </span>

                <span className="text-sm text-gray-400">
                  {author_occupation}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
