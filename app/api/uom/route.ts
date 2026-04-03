import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, description } = await req.json();

  await query(
    "INSERT INTO uom(name, description) VALUES($1,$2)",
    [name, description]
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();

  await query("DELETE FROM uom WHERE id=$1", [id]);

  return NextResponse.json({ success: true });
}

export async function PUT(req: Request) {
  const { id, name, description } = await req.json();

  await query(
    "UPDATE uom SET name=$1, description=$2 WHERE id=$3",
    [name, description, id]
  );

  return NextResponse.json({ success: true });
}

export async function GET() {
  const result = await query("SELECT * FROM uom ORDER BY id ASC");
  return Response.json(result.rows);
}