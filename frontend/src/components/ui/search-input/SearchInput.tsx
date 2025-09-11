'use client'
import React from "react";

export default function SearchInput() {
  return (
    <div className="sticky top-0 left-0 right-0 py-2 px-6 w-full flex justify-center bg-black/80 z-1000">
    <form className="flex rounded-md border-2 border-blue-500 overflow-hidden w-full">
      <input
        placeholder="Search Something..."
        className="w-full outline-none bg-gray-600/50 text-white px-4 py-3 hover:bg-gray-600/20 focus:bg-gray-600/20 transtion duration-300 text-md"
      />
      <button
        type="submit"
        area-label = "search"
        name="search"
        className="flex items-center justify-center bg-[#007bff] px-5 cursor-pointer hover:bg-blue-700 transition duration-150"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 192.904 192.904"
          width="16px"
          className="fill-white"
        >
          <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
        </svg>
      </button>
    </form>
    </div>
  );
}
