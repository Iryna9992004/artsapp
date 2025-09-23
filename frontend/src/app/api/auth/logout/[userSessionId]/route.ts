import { $api } from "@/shared/api";
import { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest,{ params }: { params: { userSessionId: string } }) {
  try {
    await $api.get(`/auth/logout/${params.userSessionId}`);
    return NextResponse.json(
      { message: "User logged out successfuly" },
      { status: 200 }
    );
  } catch (e) {
    if (e instanceof AxiosError) {
      return NextResponse.json({ message: e.message }, { status: e.status });
    }
    return NextResponse.json({ message: "Failed to refresh" }, { status: 500 });
  }
}
