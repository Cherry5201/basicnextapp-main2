"use client";

import { useEffect, useState } from "react";
import ExportButtons from "@/components/ExportButtons";

export default function Page() {
  const [data, setData] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const load = async () => {
    const res = await fetch("/api/testcategories/get");
    setData(await res.json());
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!name) return alert("Name required");

    await fetch("/api/testcategories", {
      method: "POST",
      body: JSON.stringify({ name, description: desc }),
    });

    setName("");
    setDesc("");
    load();
  };

  const update = async () => {
    if (!selectedId) return alert("Select a row");

    await fetch("/api/testcategories", {
      method: "PUT",
      body: JSON.stringify({ id: selectedId, name, description: desc }),
    });

    load();
  };

  const remove = async () => {
    if (!selectedId) return alert("Select a row");

    await fetch("/api/testcategories", {
      method: "DELETE",
      body: JSON.stringify({ id: selectedId }),
    });

    setSelectedId(null);
    setName("");
    setDesc("");
    load();
  };

  const handleRowClick = (row: any) => {
    setSelectedId(row.id);
    setName(row.name);
    setDesc(row.description);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Test Categories</h1>

      <table style={tableStyle}>
        <thead style={theadStyle}>
          <tr>
            <th style={th}>ID</th>
            <th style={th}>Name</th>
            <th style={th}>Description</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
              onClick={() => handleRowClick(row)}
              style={{ cursor: "pointer", background: row.id === selectedId ? "#eef" : "white" }}
            >
              <td style={td}>{row.id}</td>
              <td style={td}>{row.name}</td>
              <td style={td}>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "15px" }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description" />
      </div>

      <div style={{ marginTop: "10px" }}>
        <button style={btnBlue} onClick={create}>Create</button>
        <button style={btnGreen} onClick={update}>Update</button>
        <button style={btnRed} onClick={remove}>Delete</button>
        <ExportButtons
          endpoint="/api/testcategories"
          filename="Categories"
          columns={["ID", "Name", "Description"]}
          keys={["id", "name", "description"]}
        />
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