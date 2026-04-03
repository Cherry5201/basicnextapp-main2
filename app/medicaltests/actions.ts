"use server";
import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createMedicalTest(data: any) {
  const { name, iduom, idcategory, min, max } = data;
  if (!name) return;

  await query(
    `INSERT INTO medicaltests(name, iduom, idcategory, normalmin, normalmax)
     VALUES($1,$2,$3,$4,$5)`,
    [name, iduom, idcategory, min, max]
  );

  revalidatePath("/medicaltests");
}

export async function updateMedicalTest(data: any) {
  await query(
    `UPDATE medicaltests
     SET name=$1, iduom=$2, idcategory=$3, normalmin=$4, normalmax=$5
     WHERE id=$6`,
    [
      data.name,
      data.iduom,
      data.idcategory,
      data.min,
      data.max,
      data.id,
    ]
  );
  revalidatePath("/medicaltests");
}

export async function deleteMedicalTest(id: string) {
  await query(`DELETE FROM medicaltests WHERE id=$1`, [id]);
  revalidatePath("/medicaltests");
}