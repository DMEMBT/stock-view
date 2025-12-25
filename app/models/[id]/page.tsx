"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function SelectedRowPage() {
  const router = useRouter();
  const params = useParams();
  const [payload, setPayload] = useState<{ headers: string[]; row: unknown; topRow?: unknown[] } | null>(null);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? sessionStorage.getItem("selectedRow") : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        setPayload(parsed);
      }
    } catch (e) {
      setPayload(null);
    }
  }, [params?.id]);

  if (!payload) {
    return (
      <div className="p-6">
        <div className="mb-4">No row selected.</div>
        <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => router.back()}>
          Go back
        </button>
      </div>
    );
  }

  const { headers, row, topRow } = payload;

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Selected Row</h2>
        <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => router.back()}>
          Back
        </button>
      </div>

      {topRow && (
        <div className="mb-4 p-3 bg-gray-50 border rounded">
          <strong className="block mb-2">Top Row</strong>
          <div className="text-sm text-gray-700">{(topRow as unknown[]).map((c, i) => <span key={i} className="inline-block mr-3">{String(c ?? "")}</span>)}</div>
        </div>
      )}

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            <th className="text-left font-medium py-2">Column</th>
            <th className="text-left font-medium py-2">Value</th>
          </tr>
        </thead>
        <tbody>
          {headers.map((h, idx) => {
            const val = Array.isArray(row) ? (row as unknown[])[idx] : (row as Record<string, unknown>)[h];
            return (
              <tr key={h + idx} className="border-t">
                <td className="py-2 px-2 align-top w-1/3">{h}</td>
                <td className="py-2 px-2">{val !== null && val !== undefined && String(val).trim() !== "" ? String(val) : "-"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
