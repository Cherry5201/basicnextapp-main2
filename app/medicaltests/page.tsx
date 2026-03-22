import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";

// CREATE
async function create(formData: FormData) {
  "use server";

  const name = formData.get("name");
  const iduom = formData.get("iduom");
  const idcategory = formData.get("idcategory");
  const min = formData.get("min");
  const max = formData.get("max");

  if (!name) return;

  await query(
    `INSERT INTO medicaltests(name, iduom, idcategory, normalmin, normalmax)
     VALUES($1,$2,$3,$4,$5)`,
    [name, iduom, idcategory, min, max]
  );

  revalidatePath("/medicaltests");
}

// UPDATE
async function update(formData: FormData) {
  "use server";

  const id = formData.get("id");

  await query(
    `UPDATE medicaltests
     SET name=$1, iduom=$2, idcategory=$3, normalmin=$4, normalmax=$5
     WHERE id=$6`,
    [
      formData.get("name"),
      formData.get("iduom"),
      formData.get("idcategory"),
      formData.get("min"),
      formData.get("max"),
      id,
    ]
  );

  revalidatePath("/medicaltests");
}

// DELETE
async function remove(formData: FormData) {
  "use server";

  const id = formData.get("id");

  await query("DELETE FROM medicaltests WHERE id=$1", [id]);

  revalidatePath("/medicaltests");
}

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

  return (
    <div style={{ padding: "20px" }}>
      <h1>Medical Tests</h1>

      {/* TABLE */}
      <table style={tableStyle}>
        <thead style={theadStyle}>
          <tr>
            <th style={th}>ID</th>
            <th style={th}>Name</th>
            <th style={th}>Category</th> 
            <th style={th}>Unit</th>    
            <th style={th}>Min</th>
            <th style={th}>Max</th>
          </tr>
        </thead>

        <tbody>
          {result.rows.map((row: any) => (
            <tr key={row.id}>
              <td style={td}>{row.id}</td>
              <td style={td}>{row.name}</td>
              <td style={td}>{row.category}</td> 
              <td style={td}>{row.unit}</td>     
              <td style={td}>{row.normalmin}</td>
              <td style={td}>{row.normalmax}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* FORM */}
      <form>
        <input name="id" placeholder="ID (for update/delete)" />
        <input name="name" placeholder="Name" />
        <input name="iduom" placeholder="UOM ID" />
        <input name="idcategory" placeholder="Category ID" />
        <input name="min" placeholder="Min" />
        <input name="max" placeholder="Max" />

        <div style={{ marginTop: "10px" }}>
          <button formAction={create} style={btnBlue}>Create</button>
          <button formAction={update} style={btnGreen}>Update</button>
          <button formAction={remove} style={btnRed}>Delete</button>
        </div>
      </form>
      
    </div>
  );
}

/* styles */
const btnBlue: React.CSSProperties = { padding: "6px 12px", background: "blue", color: "white", marginRight: "5px", border: "none" };
const btnGreen: React.CSSProperties = { padding: "6px 12px", background: "green", color: "white", marginRight: "5px", border: "none" };
const btnRed: React.CSSProperties = { padding: "6px 12px", background: "red", color: "white", border: "none" };

const tableStyle: React.CSSProperties = { borderCollapse: "collapse", width: "100%", marginTop: "15px" };
const theadStyle: React.CSSProperties = { background: "#333", color: "white" };
const th: React.CSSProperties = { border: "1px solid", padding: "8px", cursor: "default" };
const td: React.CSSProperties = { border: "1px solid", padding: "8px" };