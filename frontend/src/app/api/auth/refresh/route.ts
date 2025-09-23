import { $api } from "@/shared/api";
import { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(body.userSessionId);
    const resp = await $api.get(`/auth/refresh/${body.userSessionId}`);
    console.log(resp);
    return NextResponse.json(
      { message: "Token refreshed successfuly" },
      { status: 200 }
    );
  } catch (e) {
    if (e instanceof AxiosError) {
      return NextResponse.json({ message: e.message }, { status: e.status });
    }
    return NextResponse.json({ message: "Failed to refresh" }, { status: 500 });
  }
}
