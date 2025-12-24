"use client";
import React, { useMemo, useState } from "react";
import DataTable from "./DataTable";

export default function SheetViewer({ data }: { data: Record<string, unknown>[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query) return data;
    const q = query.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((v) => String(v ?? "").toLowerCase().includes(q))
    );
  }, [data, query]);

  return (
    <div>
      <div className="mb-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          aria-label="Search rows"
          className="w-full rounded border px-3 py-2"
        />
        <div className="text-sm text-gray-600 mt-2">
          Showing {filtered.length} of {data.length} rows
        </div>
      </div>
      <DataTable data={filtered} />
    </div>
  );
}
