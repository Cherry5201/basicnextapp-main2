"use client";

import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";

interface Props {
  endpoint: string;
  filename: string;
  columns: string[];
  keys: string[];
}

export default function ExportButtons({ endpoint, filename, columns, keys }: Props) {

  const exportExcel = async () => {
    const res = await fetch(endpoint);
    const data = await res.json();

    const sheetData = [
      columns,
      ...data.map((row: any) => keys.map((k) => row[k] ?? "")),
    ];

    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf]), `${filename}.xlsx`);
  };

  const exportPDF = async () => {
    const res = await fetch(endpoint);
    const data = await res.json();

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    let startX = 10;
    let startY = 20;
    let rowHeight = 8;
    let colWidth = 30;

    // Title
    doc.setFontSize(16);
    doc.text(filename, startX, 10);

    doc.setFontSize(10);

    // HEADER
    columns.forEach((col, i) => {
      doc.rect(startX + i * colWidth, startY, colWidth, rowHeight);
      doc.text(col, startX + i * colWidth + 2, startY + 5);
    });

    startY += rowHeight;

    // ROWS
    data.forEach((row: any) => {
        let maxLines = 1;

        const cellTexts = keys.map((key) => {
            const text = String(row[key] ?? "");
            const split = doc.splitTextToSize(text, colWidth - 4);
            if (split.length > maxLines) maxLines = split.length;
            return split;
        });

        const dynamicHeight = maxLines * 6; // adjust spacing

        cellTexts.forEach((lines, i) => {
            const x = startX + i * colWidth;

            doc.rect(x, startY, colWidth, dynamicHeight);
            doc.text(lines, x + 2, startY + 5);
        });

        startY += dynamicHeight;

        if (startY > 280) {
            doc.addPage();
            startY = 20;
        }
        });

    doc.save(`${filename}.pdf`);
  };

  return (
    <div style={{ marginTop: "10px" }}>
      <button onClick={exportExcel} style={btnBlue}>Export Excel</button>
      <button onClick={exportPDF} style={btnRed}>Export PDF</button>
    </div>
  );
}

const btnBlue: React.CSSProperties = {
  padding: "6px 12px",
  background: "blue",
  color: "white",
  marginRight: "5px",
  border: "none",
};

const btnRed: React.CSSProperties = {
  padding: "6px 12px",
  background: "red",
  color: "white",
  border: "none",
};