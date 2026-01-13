import Link from "next/link";
import React from "react";
import { Music, Calendar, User } from "react-feather";
import { PostProps } from "./types";

export default function Post({
  date,
  title,
  description,
  author,
  author_occupation,
}: PostProps) {
  return (
    <Link href={`/posts/info/1?title=How to use optimization`}>
      <div className="group relative flex flex-col gap-5 p-6 bg-gradient-to-br from-blue-900/50 via-blue-800/40 to-purple-900/30 hover:from-blue-900/60 hover:via-blue-800/50 hover:to-purple-900/40 transition-all duration-300 rounded-2xl cursor-pointer border border-blue-700/30 hover:border-blue-600/50 shadow-lg hover:shadow-2xl hover:shadow-blue-900/20">
        {/* Date Badge */}
        <div className="flex items-center gap-2 text-xs font-medium">
          <Calendar size={14} className="text-blue-400" />
          <span className="text-blue-300">{date}</span>
        </div>

        {/* Title */}
        <h2 className="text-white text-2xl font-bold leading-tight group-hover:text-blue-200 transition-colors duration-200">
          {title}
        </h2>

        {/* Description */}
        <p className="text-gray-300 text-base leading-relaxed line-clamp-3">
          {description}
        </p>

        {/* Divider */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

        {/* Author Info */}
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 flex text-white items-center justify-center rounded-full shadow-md group-hover:scale-110 transition-transform duration-200">
            <Music size={20} />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <User size={14} className="text-blue-400" />
              <span className="text-base font-semibold text-white">
                {author}
              </span>
            </div>

            {author_occupation && (
              <span className="text-sm text-gray-400 italic">
                {author_occupation}
              </span>
            )}
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/0 to-purple-600/0 group-hover:from-blue-400/5 group-hover:to-purple-600/5 transition-all duration-300 pointer-events-none" />
      </div>
    </Link>
  );
}
