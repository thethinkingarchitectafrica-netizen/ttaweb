import { NextResponse } from "next/server";
import { getEvents } from "@/app/lib/data-service";

export async function GET() {
  const events = await getEvents();
  return NextResponse.json(events);
}
