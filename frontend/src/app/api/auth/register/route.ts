import { $api } from "@/shared/api";
import { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, full_name, occupation } = body;
    const apiResponse = await $api.post("/auth/register", {
      email,
      pass: password,
      full_name,
      occupation,
    });
    return NextResponse.json(
      { success: true, data: apiResponse.data },
      { status: 200 }
    );
  } catch (e) {
    if (e instanceof AxiosError) {
      return NextResponse.json(
        { message: e.response?.data.message },
        { status: e.status }
      );
    }
    return NextResponse.json(
      { message: "Failed to register" },
      { status: 500 }
    );
  }
}
