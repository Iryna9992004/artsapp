import React from "react";

export default function DragAndDrop() {
  return (
    <div className="relative">
      <input type="file" className="w-full h-50 cursor-pointer" />
      <div className="absolute top-0 bottom-0 left-0 right-0 pointer-events-none p-5 rounded-3xl bg-[#20232B] h-50 border border-gray-600 hover:border-white">
        <div className="w-full h-full bg-[#2F2F2F] rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-600">
          <span className="text-xl text-white font-bold">Drag and Drop</span>
          <span className="text-md text-gray-300 font-medium">
            Drag and Drop your files here
          </span>
        </div>
      </div>
    </div>
  );
}
