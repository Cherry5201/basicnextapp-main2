import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await query(
    "SELECT * FROM testcategories ORDER BY id ASC"
  );
  return NextResponse.json(result.rows);
}