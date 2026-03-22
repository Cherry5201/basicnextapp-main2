import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await query(`
    SELECT 
      mt.id,
      mt.name,
      tc.name AS category,
      u.name AS unit,
      mt.normalmin,
      mt.normalmax
    FROM medicaltests mt
    JOIN testcategories tc ON mt.idcategory = tc.id
    JOIN uom u ON mt.iduom = u.id
  `);

  return NextResponse.json(result.rows);
}