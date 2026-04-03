import { query } from "@/lib/db";
import MedicalTestsClient from "./MedicalTestsClient";

export default async function Page() {
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
    ORDER BY mt.id ASC
  `);

  return <MedicalTestsClient initialData={result.rows} />;
}