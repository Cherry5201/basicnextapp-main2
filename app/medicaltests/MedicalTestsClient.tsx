"use client";

import { useState } from "react";
import ExportButtons from "@/components/ExportButtons";
import {
  createMedicalTest,
  updateMedicalTest,
  deleteMedicalTest,
} from "./actions";
import ConfirmModal from "@/components/ConfirmModal";

export default function MedicalTestsClient({ initialData }: any) {
  const [data, setData] = useState(initialData);

  const [form, setForm] = useState({
    id: "",
    name: "",
    iduom: "",
    idcategory: "",
    min: "",
    max: "",
  });

    const handleRowClick = (row: any) => {
    setForm({
        id: row.id,
        name: row.name,
        iduom: row.iduom || "",        // ✅ FIX
        idcategory: row.idcategory || "", // ✅ FIX
        min: row.normalmin,
        max: row.normalmax,
    });
    };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const refresh = async () => {
    const res = await fetch("/api/medicaltests");
    setData(await res.json());
  };

  const handleCreate = async () => {
    await createMedicalTest(form);
    refresh();
  };

  const handleUpdate = async () => {
    if (!form.iduom || !form.idcategory) {
        alert("UOM ID and Category ID required");
        return;
    }

    await updateMedicalTest({
        id: Number(form.id),
        name: form.name,
        iduom: Number(form.iduom),
        idcategory: Number(form.idcategory),
        min: Number(form.min),
        max: Number(form.max),
    });

    refresh();
    };

  const handleDelete = async () => {
    if (!form.id) return;
    const confirmed = await ConfirmModal("Are you sure you want to delete this medical test?");
    if (!confirmed) return;

    await deleteMedicalTest(form.id);
    refresh();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Medical Tests</h1>

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
          {data.map((row: any) => (
            <tr key={row.id} onClick={() => handleRowClick(row)} style={{ cursor: "pointer" }}>
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

      <div style={{ marginTop: "20px" }}>
        <input name="id" value={form.id} onChange={handleChange} placeholder="ID(For Update&Delete)" />
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
        <input name="iduom" value={form.iduom} onChange={handleChange} placeholder="UOM ID" />
        <input name="idcategory" value={form.idcategory} onChange={handleChange} placeholder="Category ID" />
        <input name="min" value={form.min} onChange={handleChange} placeholder="Min" />
        <input name="max" value={form.max} onChange={handleChange} placeholder="Max" />

        <div style={{ marginTop: "10px" }}>
          <button onClick={handleCreate} style={btnBlue}>Create</button>
          <button onClick={handleUpdate} style={btnGreen}>Update</button>
          <button onClick={handleDelete} style={btnRed}>Delete</button>

          <ExportButtons
            endpoint="/api/medicaltests"
            filename="MedicalTests"
            columns={["ID", "Name", "Category", "Unit", "Min", "Max"]}
            keys={["id", "name", "category", "unit", "normalmin", "normalmax"]}
          />
        </div>
      </div>
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