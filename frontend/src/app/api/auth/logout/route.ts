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

    const response = await $api.post("/auth/logout", {
      refreshToken,
    });
    
    return NextResponse.json(
      { message: "Logged out successfully", data: response.data },
      { status: 200 }
    );
  } catch (e) {
    if (e instanceof AxiosError) {
      return NextResponse.json(
        { message: e.response?.data.message || "Failed to logout" },
        { status: e.status || 500 }
      );
    }
    return NextResponse.json({ message: "Failed to logout" }, { status: 500 });
  }
}
