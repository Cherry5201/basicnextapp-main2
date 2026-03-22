import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, iduom, idcategory, normalmin, normalmax } = await req.json();

  await query(
    `INSERT INTO medicaltests(name, iduom, idcategory, normalmin, normalmax)
     VALUES($1,$2,$3,$4,$5)`,
    [name, iduom, idcategory, normalmin, normalmax]
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();

  await query("DELETE FROM medicaltests WHERE id=$1", [id]);

  return NextResponse.json({ success: true });
}

export async function PUT(req: Request) {
  const { id, name, iduom, idcategory, normalmin, normalmax } = await req.json();

  await query(
    `UPDATE medicaltests 
     SET name=$1, iduom=$2, idcategory=$3, normalmin=$4, normalmax=$5
     WHERE id=$6`,
    [name, iduom, idcategory, normalmin, normalmax, id]
  );

  return NextResponse.json({ success: true });
}