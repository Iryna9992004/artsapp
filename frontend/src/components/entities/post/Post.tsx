import React from "react";
import { Music } from "react-feather";

export default function Post() {
  return (
    <div className="flex flex-col lg:flex-row items-start gap-4 p-4 bg-blue-800/40 hover:bg-blue-900/40 transition duration-150 rounded-2xl cursor-pointer">
      <div className="h-50 w-200 max-w-full bg-blue-500 rounded-xl" />
      <div>
        <div className="flex flex-col gap-4 h-full">
          <span className="text-sm text-gray-400">Mar 10, 2020</span>
          <h2 className="text-white text-xl font-bold">
            How to use this optimization
          </h2>

          <p className="text-md text-gray-400">
            Sed ut perspiciatis, unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam eaque ipsa,
            quae ab illo inventore veritatis et quasi architecto beatae vitae
            dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas
            sit, aspernatur aut odit aut fugit, sed quia consequuntur magni d
          </p>

          <div className="h-[1px] bg-gray-300 w-full" />

          <div className="flex items-center gap-3">
            <div className="p-4 bg-blue-500 flex text-white items-center justify-center rounded-full">
              <Music />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-lg font-semibold text-white">John Doe</span>

              <span className="text-sm text-gray-400">Passionate composer</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
