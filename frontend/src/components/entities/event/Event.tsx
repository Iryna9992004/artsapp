import React from "react";

export default function Event() {
  return (
    <div className="flex flex-col max-h-fit w-full max-w-80 rounded-xl bg-violet-300/20 hover:bg-violet-300/10 transition duration-150 cursor-pointer">
      <div className="h-55 bg-blue-500 w-full rounded-tl-xl rounded-tr-xl"></div>
      <div className="p-4 w-full flex-1 flex flex-col gap-4 justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-purple-300">Piano</span>
          <h2 className="font-bold text-xl text-white">
            Improve your customer experience
          </h2>
          <span className="text-gray-400 text-sm">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore veritatis et quasi architecto beatae vitae
            dicta sunt explicabo.
          </span>
        </div>

        <div className="flex flex-col hap-2">
          <span className="text-sm text-white">Paul York</span>
          <span className="text-xs text-gray-400">Mar 16, 2020</span>
        </div>
      </div>
    </div>
  );
}
