"use client";
import CreateEventForm from "@/components/features/create-event-form";
import React from "react";

export default function Create() {
  return (
    <div className="p-6 pt-20 flex justify-center items-center w-full h-[90vh] max-h-full overflow-y-auto">
      <CreateEventForm />
    </div>
  );
}
