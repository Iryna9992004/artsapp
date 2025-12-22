import { $api } from "@/shared/api/axios";
import { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;
    const apiResponse = await $api.post("/auth/login", {
      email,
      pass: password,
    });

    return NextResponse.json(
      { data: { ...apiResponse.data } },
      { status: 200 }
    );
  } catch (e) {
    if (e instanceof AxiosError) {
      return NextResponse.json(
        { message: e.response?.data.message },
        { status: e.status }
      );
    }
    return NextResponse.json({ message: "Failed to login" }, { status: 500 });
  }
}
