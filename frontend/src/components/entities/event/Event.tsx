import React from "react";
import { EventProps } from "./types";
import { Calendar, User, Music, Star } from "react-feather";

export default function Event({
  title,
  description,
  author,
  date,
}: EventProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "Recently";
    try {
      const eventDate = new Date(dateString);
      if (isNaN(eventDate.getTime())) return "Recently";
      
      return eventDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (e) {
      return "Recently";
    }
  };

  return (
    <div className="group relative flex flex-col gap-5 p-6 h-full bg-gradient-to-br from-purple-900/50 via-violet-800/40 to-pink-900/30 hover:from-purple-900/60 hover:via-violet-800/50 hover:to-pink-900/40 transition-all duration-300 rounded-2xl cursor-pointer border border-purple-700/30 hover:border-purple-600/50 shadow-lg hover:shadow-2xl hover:shadow-purple-900/20">
      {/* Header with Icon */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 flex text-white items-center justify-center rounded-full shadow-md group-hover:scale-110 transition-transform duration-200">
            <Star size={20} fill="white" />
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-purple-400" />
            <span className="text-xs font-medium text-purple-300">
              {formatDate(date)}
            </span>
          </div>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-white text-xl font-bold leading-tight group-hover:text-purple-200 transition-colors duration-200 line-clamp-2">
        {title}
      </h2>

      {/* Description */}
      <p className="text-gray-300 text-sm leading-relaxed line-clamp-3 flex-1">
        {description}
      </p>

      {/* Divider */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

      {/* Author Info */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 flex text-white items-center justify-center rounded-full shadow-md">
          <Music size={16} />
        </div>
        <div className="flex items-center gap-2">
          <User size={12} className="text-purple-400" />
          <span className="text-sm font-semibold text-white">
            {author || "Unknown Artist"}
          </span>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400/0 to-pink-600/0 group-hover:from-purple-400/5 group-hover:to-pink-600/5 transition-all duration-300 pointer-events-none" />
    </div>
  );
}
