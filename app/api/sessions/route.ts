import { NextResponse } from "next/server";
import { getSessions } from "@/app/lib/data-service";

export async function GET() {
  const sessions = await getSessions();
  return NextResponse.json(sessions);
}
