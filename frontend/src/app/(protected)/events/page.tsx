import Event from "@/components/entities/event";
import React from "react";

export default function Events() {
  return (
    <div className="p-6 pb-30 flex flex-wrap items-center justify-center w-full max-h-[90vh] overflow-y-auto gap-4">
      <Event />
      <Event />
      <Event />
      <Event />
    </div>
  );
}
