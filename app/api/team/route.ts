import { NextResponse } from "next/server";
import { getTeam } from "@/app/lib/data-service";

export async function GET() {
  const team = await getTeam();
  return NextResponse.json(team);
}
