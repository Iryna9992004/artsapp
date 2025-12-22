import { $api } from "@/shared/api/axios";
import { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{
      userSessionId: string;
      id: string;
      full_name: string;
      email: string;
    }>;
  }
) {
  try {
    const params = await context.params;
    const apiResponse = await $api.get(`/auth/refresh/${params.userSessionId}`);
    return NextResponse.json(
      {
        message: "Token refreshed successfuly",
        data: { ...apiResponse.data },
      },
      { status: 200 }
    );
  } catch (e) {
    console.log(e);
    if (e instanceof AxiosError) {
      return NextResponse.json(
        { message: e.response?.data.message },
        { status: e.status }
      );
    }
    return NextResponse.json({ message: "Failed to refresh" }, { status: 500 });
  }
}
