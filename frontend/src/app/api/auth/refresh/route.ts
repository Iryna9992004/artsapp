import { $api } from "@/shared/api/axios";
import { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { refreshToken } = body;
    
    if (!refreshToken) {
      return NextResponse.json(
        { message: "Refresh token is required" },
        { status: 400 }
      );
    }

    const apiResponse = await $api.post("/auth/refresh", {
      refreshToken,
    });
    
    return NextResponse.json(
      {
        message: "Token refreshed successfully",
        data: { ...apiResponse.data },
      },
      { status: 200 }
    );
  } catch (e) {
    console.log(e);
    if (e instanceof AxiosError) {
      return NextResponse.json(
        { message: e.response?.data.message || "Failed to refresh token" },
        { status: e.status || 401 }
      );
    }
    return NextResponse.json({ message: "Failed to refresh" }, { status: 500 });
  }
}
