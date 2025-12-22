import { $api } from "@/shared/api/axios";
import { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userSessionId: string }> }
) {
  try {
    const params = await context.params;
    const response = await $api.get(`/auth/refresh/${params.userSessionId}`);
    return NextResponse.json(
      { message: "Token refreshed successfully", data: response.data },
      { status: 200 }
    );
  } catch (e) {
    if (e instanceof AxiosError) {
      return NextResponse.json(
        { message: e.response?.data.message },
        { status: e.status }
      );
    }
    return NextResponse.json({ message: "Failed to refresh" }, { status: 500 });
  }
}
