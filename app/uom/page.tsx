"use client";

import { useEffect, useState } from "react";

export default function UOMPage() {
  const [data, setData] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const load = async () => {
    const res = await fetch("/api/uom/get");
    setData(await res.json());
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    if (!name) return alert("Name is required");

    await fetch("/api/uom", {
      method: "POST",
      body: JSON.stringify({ name, description: desc }),
    });

    setName("");
    setDesc("");
    load();
  };

  const update = async () => {
    if (!selectedId) return alert("Select a row first");

    await fetch("/api/uom", {
      method: "PUT",
      body: JSON.stringify({
        id: selectedId,
        name,
        description: desc,
      }),
    });

    load();
  };

  const remove = async () => {
    if (!selectedId) return alert("Select a row first");

    await fetch("/api/uom", {
      method: "DELETE",
      body: JSON.stringify({ id: selectedId }),
    });

    load();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>UOM</h1>

      {/* TABLE */}
      <table style={tableStyle}>
        <thead style={theadStyle}>
          <tr>
            <th style={th}>Select</th>
            <th style={th}>ID</th>
            <th style={th}>Name</th>
            <th style={th}>Description</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td style={td}>
                <input
                  type="radio"
                  name="select"
                  onChange={() => {
                    setSelectedId(row.id);
                    setName(row.name);          
                    setDesc(row.description);   
                  }}
                />
              </td>
              <td style={td}>{row.id}</td>
              <td style={td}>{row.name}</td>
              <td style={td}>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* INPUT */}
      <div>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
      </div>

      {/* BUTTONS */}
      <div style={{ marginTop: "10px" }}>
        <button style={btnBlue} onClick={create}>Create</button>
        <button style={btnGreen} onClick={update}>Update</button>
        <button style={btnRed} onClick={remove}>Delete</button>
      </div>
      
    </div>
  );
}

/* 🎨 STYLES */
const btnBlue: React.CSSProperties = { padding: "6px 12px", background: "blue", color: "white", marginRight: "5px", border: "none" };
const btnGreen: React.CSSProperties = { padding: "6px 12px", background: "green", color: "white", marginRight: "5px", border: "none" };
const btnRed: React.CSSProperties = { padding: "6px 12px", background: "red", color: "white", border: "none" };

const tableStyle: React.CSSProperties = { borderCollapse: "collapse", width: "100%", marginTop: "15px" };
const theadStyle: React.CSSProperties = { background: "#333", color: "white" };
const th: React.CSSProperties = { border: "1px solid", padding: "8px", cursor: "default" };
const td: React.CSSProperties = { border: "1px solid", padding: "8px" };