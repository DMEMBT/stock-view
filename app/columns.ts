export type Product = {
  id: string;
  name: string;
  status: "active" | "inactive";
  price: number;
  lastUpdated: string;
};

// This defines how the data looks in each column
export const columns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Product Name" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "price", header: "Price ($)" },
];