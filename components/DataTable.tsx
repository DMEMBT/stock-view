"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface DataTableProps {
  // Accept either array-of-objects or array-of-arrays (sheet rows)
  data: Record<string, unknown>[] | unknown[][];
  // When true and `data` is array-of-arrays, keep the first row visible and use the second row as header
  useSecondRowAsHeader?: boolean;
}

export default function DataTable({ data, useSecondRowAsHeader = true }: DataTableProps) {
  const router = useRouter();
  if (!data || data.length === 0) return <div className="p-10 text-center">No data found.</div>;

  // Helpers
  const isDescriptionColumn = (h: string) => /name|item name/i.test(h);

  // compute shape and derived values
  const first = data[0];
  const isArrayData = Array.isArray(first);
  let headers: string[] = [];
  let rows: (unknown[] | Record<string, unknown>)[] = [];
  let topRow: unknown[] | null = null;

  if (isArrayData) {
    const arr = data as unknown[][];
    if (useSecondRowAsHeader && arr.length >= 2) {
      topRow = Array.isArray(arr[0]) ? arr[0] : null;
      headers = (Array.isArray(arr[1]) ? arr[1] : []).map((h) => String(h ?? ""));
      rows = arr.slice(2);
    } else {
      headers = (Array.isArray(arr[0]) ? arr[0] : []).map((h) => String(h ?? ""));
      rows = arr.slice(1);
    }
  } else {
    const obj = data as Record<string, unknown>[];
    headers = Object.keys(obj[0] || {});
    rows = obj;
  }

  const totalRows = isArrayData
    ? (useSecondRowAsHeader ? Math.max(0, (data as unknown[][]).length - 2) : Math.max(0, (data as unknown[][]).length - 1))
    : (data as Record<string, unknown>[]).length;

  // single selection handler
  const handleSelectRow = (index: number, row: unknown) => {
    try {
      const payload = { headers, row, topRow };
      sessionStorage.setItem("selectedRow", JSON.stringify(payload));
    } catch {
      // ignore sessionStorage errors
    }
    router.push(`/models/${index}`);
  };

  // render a single cell
  const renderCell = (val: unknown, hdr: string | number) => {
    const headerStr = String(hdr);
    const isDesc = isDescriptionColumn(headerStr);
    const display = val !== null && val !== undefined && String(val).trim() !== "" ? String(val) : "-";
    return (
      <td
        key={headerStr}
        className={`px-3 py-1.5 text-[12px] text-gray-900 border-b border-gray-200
          ${isDesc ? "whitespace-normal break-words min-w-[300px]" : "whitespace-nowrap text-center"}
        `}
        title={String(val ?? "")}
      >
        {display}
      </td>
    );
  };

  // small subcomponents for clarity
  const HeaderRow = () => (
    <thead className="sticky top-0 z-10 bg-gray-100 shadow-sm">
      <tr className="divide-x divide-gray-300">
        {headers.map((header, idx) => (
          <th
            key={String(header) + idx}
            className={`px-3 py-2 text-left text-[11px] font-bold text-gray-700 uppercase tracking-tight border-b border-gray-300 bg-[#f8f9fa]
              ${isDescriptionColumn(header) ? "w-[400px]" : "w-[100px]"}
            `}
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );

  const DataRow = ({ row, idx }: { row: unknown[] | Record<string, unknown>; idx: number }) => (
    <tr
      key={idx}
      role="button"
      tabIndex={0}
      onClick={() => handleSelectRow(idx, row)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleSelectRow(idx, row);
      }}
      className="divide-x divide-gray-300 hover:bg-[#f1f3f4] transition-colors leading-tight cursor-pointer"
    >
      {Array.isArray(row)
        ? headers.map((_, colIndex) => renderCell((row as unknown[])[colIndex], headers[colIndex] ?? colIndex))
        : headers.map((header) => renderCell((row as Record<string, unknown>)[header], header))}
    </tr>
  );

  return (
    <div className="flex flex-col h-[80vh]">
      <div className="overflow-x-auto overflow-y-auto border border-gray-300 rounded-sm shadow-inner bg-white">

        {/* show first/top row if present (kept as-is per request) */}
        {topRow && (
          <div className="px-3 py-2 bg-gray-50 text-sm text-gray-700 border-b border-gray-200">
            {(topRow as unknown[]).map((c, i) => (
              <span key={i} className="inline-block mr-4">
                {String(c ?? "")}
              </span>
            ))}
          </div>
        )}

        <table className="min-w-max border-collapse">
          <HeaderRow />
          <tbody className="divide-y divide-gray-200">
            {rows.map((row, i) => (
              <DataRow key={i} row={row} idx={i} />
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-[12px] text-gray-500 mt-2 px-1">
        Showing {totalRows} rows
      </div>
    </div>
  );
}