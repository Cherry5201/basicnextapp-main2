import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  const result = await query(`
    SELECT 
      mt.id,
      mt.name,
      mt.iduom,         
      mt.idcategory,    
      tc.name AS category,
      u.name AS unit,
      mt.normalmin,
      mt.normalmax
    FROM medicaltests mt
    JOIN testcategories tc ON mt.idcategory = tc.id
    JOIN uom u ON mt.iduom = u.id
    ORDER BY mt.id ASC
  `);
  return NextResponse.json(result.rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  await query(
    `INSERT INTO medicaltests(name, iduom, idcategory, normalmin, normalmax)
     VALUES($1,$2,$3,$4,$5)`,
    [body.name, body.iduom, body.idcategory, body.min, body.max]
  );
  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  await query(
    `UPDATE medicaltests SET name=$1, iduom=$2, idcategory=$3, normalmin=$4, normalmax=$5
     WHERE id=$6`,
    [body.name, body.iduom, body.idcategory, body.min, body.max, body.id]
  );
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  await query(`DELETE FROM medicaltests WHERE id=$1`, [body.id]);
  return NextResponse.json({ success: true });
}