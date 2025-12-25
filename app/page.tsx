import Papa from "papaparse";
import SheetViewer from "@/components/SheetViewer";

function buildCsvUrl(input: string) {
  if (!input) return input;
  // If already CSV-like, return as-is
  if (input.endsWith('.csv') || input.includes('output=csv') || input.includes('format=csv')) return input;

  // Match common Google Sheets URLs and construct export CSV URL
  const match = input.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match) {
    const id = match[1];
    const gidMatch = input.match(/[?&]gid=(\d+)/);
    const gid = gidMatch ? gidMatch[1] : '0';
    return `https://docs.google.com/spreadsheets/d/${id}/export?format=csv&gid=${gid}`;
  }

  return input;
}

async function getSheetData(): Promise<Record<string, unknown>[]> {
  const SHEET_URL = process.env.SHEET_CSV_URL || "https://docs.google.com/spreadsheets/d/1gY_QQ16DNmcNX2C-js33_LYSpdUoXAq8qmmg1hmc8qg/edit?gid=0#gid=0";
  const csvUrl = buildCsvUrl(SHEET_URL);

  const response = await fetch(csvUrl, { cache: 'no-store' });
  const text = await response.text();
  // console.log(text.slice(0, 1000)); // Log first 200 characters for debugging

  // If server returned HTML (a sheet page) instead of CSV, give a helpful error
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('text/html') || text.trim().startsWith('<!DOCTYPE') || text.includes('<html')) {
    throw new Error(`Expected CSV but fetched HTML. Make sure the sheet is published or use a CSV export link. Tried: ${csvUrl}`);
  }

  const parsed = Papa.parse<Record<string, unknown>>(text, {
    header: true,
    skipEmptyLines: true,
  });

  return parsed.data as Record<string, unknown>[];
}

export default async function SpreadsheetPage() {
  const data = await getSheetData();

  return (
    <div className="p-4 bg-[#e8eaed] min-h-screen">
      <div className="bg-white p-1 rounded shadow-sm border border-gray-300">
      <h2 className="text-sm font-bold p-0 text-gray-600">Inventory Management</h2>
      <SheetViewer data={data} />
      </div>
    </div>
  );
}