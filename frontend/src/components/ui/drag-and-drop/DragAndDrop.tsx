import React, { useRef } from "react";
import { DragAndPropsProps } from "./types";
import { Folder, X } from "react-feather";

export default function DragAndDrop({
  value,
  setValue,
  errorMessage,
}: DragAndPropsProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      return;
    }
    const file = files[0];
    setValue(file);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="file"
        className="w-full h-50 cursor-pointer"
        onChange={handleFileChange}
      />
      <div className="absolute top-0 bottom-0 left-0 right-0 pointer-events-none p-5 rounded-3xl bg-[#20232B] h-50 border border-gray-600 hover:border-white">
        <div className="w-full h-full bg-[#2F2F2F] rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-600">
          <span className="text-xl text-white font-bold">Drag and Drop</span>
          <span className="text-md text-gray-300 font-medium">
            Drag and Drop your files here
          </span>
        </div>
      </div>

      {value?<div className="flex items-center gap-3 text-white p-3 rounded-full w-fit bg-blue-600 mt-2">
        <div className="flex items-center gap-3">
          <Folder />
          <div className="">{value?.name}</div>
        </div>
        <X className="cursor-pointer" onClick={() => setValue(null)} />
      </div>:null}

      {errorMessage ? (
        <div className="text-red-500 text-sm font-bold px-3 mt-2">{errorMessage}</div>
      ) : null}
    </div>
  );
}
