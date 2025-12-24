"use client";

interface DataTableProps {
  // Accept either array-of-objects or array-of-arrays (sheet rows)
  data: Record<string, unknown>[] | unknown[][];
  // When true and `data` is array-of-arrays, keep the first row visible and use the second row as header
  useSecondRowAsHeader?: boolean;
}

export default function DataTable({ data, useSecondRowAsHeader = true }: DataTableProps) {
  if (!data || data.length === 0) return <div className="p-10 text-center">No data found.</div>;

  // Helpers
  const isDescriptionColumn = (h: string) => /name|item name/i.test(h);

  // Support two shapes:
  // 1) array-of-objects: [{colA: val, colB: val}, ...]
  // 2) array-of-arrays: [[row1col1, row1col2], [hdr1, hdr2], [r1c1, r1c2], ...]
  let headers: string[] = [];
  let rows: (unknown[] | Record<string, unknown>)[] = [];
  let topRow: unknown[] | null = null;

  if (Array.isArray(data[0])) {
    const arr = data as unknown[][];
    if (useSecondRowAsHeader && arr.length >= 2) {
      topRow = arr[0];
      headers = (arr[1] || []).map((h) => String(h ?? ""));
      rows = arr.slice(2);
    } else {
      headers = (arr[0] || []).map((h) => String(h ?? ""));
      rows = arr.slice(1);
    }
  } else {
    const obj = data as Record<string, unknown>[];
    headers = Object.keys(obj[0]);
    rows = obj;
  }

  return (
    <div className="flex flex-col h-[80vh]">
      <div className="overflow-x-auto overflow-y-auto border border-gray-300 rounded-sm shadow-inner bg-white">

        {/* show first/top row if present (kept as-is per request) */}
        {topRow && (
          <div className="px-3 py-2 bg-gray-50 text-sm text-gray-700 border-b border-gray-200">
            {topRow.map((c, i) => (
              <span key={i} className="inline-block mr-4">
                {String(c ?? "")}
              </span>
            ))}
          </div>
        )}

        <table className="min-w-max border-collapse">
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

          <tbody className="divide-y divide-gray-200">
            {rows.map((row, i) => (
              <tr key={i} className="divide-x divide-gray-300 hover:bg-[#f1f3f4] transition-colors leading-tight">
                {Array.isArray(row)
                  ? headers.map((_, colIndex) => {
                      const val = row[colIndex];
                      const hdr = headers[colIndex] ?? String(colIndex);
                      const isDesc = isDescriptionColumn(hdr);
                      return (
                        <td
                          key={String(colIndex)}
                          className={`px-3 py-1.5 text-[12px] text-gray-900 border-b border-gray-200
                            ${isDesc ? "whitespace-normal break-words min-w-[300px]" : "whitespace-nowrap text-center"}
                          `}
                          title={String(val ?? "")}
                        >
                          {val !== null && val !== undefined && String(val).trim() !== "" ? String(val) : "-"}
                        </td>
                      );
                    })
                  : headers.map((header) => {
                      const val = (row as Record<string, unknown>)[header];
                      const isDesc = isDescriptionColumn(header);
                      return (
                        <td
                          key={header}
                          className={`px-3 py-1.5 text-[12px] text-gray-900 border-b border-gray-200
                            ${isDesc ? "whitespace-normal break-words min-w-[300px]" : "whitespace-nowrap text-center"}
                          `}
                          title={String(val ?? "")}
                        >
                          {val !== null && val !== undefined && String(val).trim() !== "" ? String(val) : "-"}
                        </td>
                      );
                    })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-[12px] text-gray-500 mt-2 px-1">
        Showing {Array.isArray(data[0]) ? (Array.isArray(data[0]) && useSecondRowAsHeader ? Math.max(0, (data as unknown[][]).length - 2) : Math.max(0, (data as unknown[][]).length - 1)) : (data as Record<string, unknown>[]).length} rows
      </div>
    </div>
  );
}