import CreateEventForm from "@/components/entities/create-event-form";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Create Event",
  description: "On this page you can create your own event",
};

export default function Create() {
  return (
    <div className="p-6 pt-20 flex justify-center items-center w-full h-[90vh] max-h-full overflow-y-auto">
      <CreateEventForm />
    </div>
  );
}
