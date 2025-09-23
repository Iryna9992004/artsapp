import { $api } from "@/shared/api";
import { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { userSessionId: string } }
) {
  try {
    const apiResponse = await $api.get(`/auth/refresh/${params.userSessionId}`);
    return NextResponse.json(
      { message: "Token refreshed successfuly", data: { ...apiResponse.data } },
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
