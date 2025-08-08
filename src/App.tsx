import Table from "./components/Table";
import { sampleData } from "./data";
import type { HeadersConfig } from "./types/table";

function App() {
  const headersConfig: HeadersConfig = {
    id: {
      key: "id",
      label: "ID",
      type: "string",
      width: "100px",
      align: "left",
    },
    amount_cents: {
      key: "amount_cents",
      label: "Amount",
      type: "currency",
      width: "150px",
      align: "center",
    },
    currency: {
      key: "currency",
      label: "Currency",
      type: "string",
      width: "100px",
      align: "center",
    },
    payment_status: {
      key: "payment_status",
      label: "Status",
      type: "status",
      width: "120px",
      align: "center",
    },
    created_at: {
      key: "created_at",
      label: "Created At",
      type: "date",
      width: "200px",
      align: "left",
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Reusable Table Component
          </h1>
          <p className="text-gray-600">
            A flexible and dynamic table component built with React and Tailwind
            CSS
          </p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Payment Records
          </h2>
          <Table
            headersConfig={headersConfig}
            data={sampleData}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}

export default App;
