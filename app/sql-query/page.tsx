"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const sqlQueries: Record<string, string> = {
  customers_per_country: `
    SELECT country, COUNT(*) as total_customers
    FROM customers
    GROUP BY country
    ORDER BY total_customers DESC;
  `,
  top_5_departments: `
    SELECT department, COUNT(*) as total_customers
    FROM customers
    GROUP BY department
    ORDER BY total_customers DESC
    LIMIT 5;
  `,
  signup_jan_jun_2025: `
    SELECT *
    FROM customers
    WHERE signup_date BETWEEN '2025-01-01' AND '2025-06-30';
  `,
  duplicate_names_unique_emails: `
    SELECT name, email
    FROM customers
    WHERE name IN (
      SELECT name
      FROM customers
      GROUP BY name
      HAVING COUNT(*) > 1
    )
    ORDER BY name;
  `,
  latest_10_customers: `
    SELECT *
    FROM customers
    ORDER BY signup_date DESC
    LIMIT 10;
  `,
};

export default function SQLPage() {
  const [selectedQuery, setSelectedQuery] = useState<string>("customers_per_country");
  const [result, setResult] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const executeQuery = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sql-query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sql: sqlQueries[selectedQuery] }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to execute query");
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <button
        onClick={() => router.push("/")}
        className="btn-primary text-white font-semibold px-6 py-3 rounded-lg shadow-md transition transform hover:-translate-y-1"
      >
        Back to Dashboard
      </button>
      <h1 className="text-3xl font-bold">SQL Query Challenge</h1>

      {/* Dropdown and Execute */}
      <div className="flex gap-4 items-center">
        <select
          value={selectedQuery}
          onChange={(e) => setSelectedQuery(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="customers_per_country">Customers per Country</option>
          <option value="top_5_departments">Top 5 Departments</option>
          <option value="signup_jan_jun_2025">Customers signed up Jan-Jun 2025</option>
          <option value="duplicate_names_unique_emails">Duplicate Names, Unique Emails</option>
          <option value="latest_10_customers">Latest 10 Customers</option>
        </select>

        <button
          onClick={executeQuery}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Executing..." : "Execute"}
        </button>
      </div>

      {/* SQL Code Box */}
      <div>
        <p className="font-medium mt-4 mb-1">SQL Query:</p>
        <pre className="bg-gray-900 text-green-300 p-4 rounded overflow-x-auto whitespace-pre-wrap">
          {sqlQueries[selectedQuery].trim()}
        </pre>
      </div>

      {/* Error */}
      {error && <p className="text-red-600">{error}</p>}

      {/* Result Table */}
      {result.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border mt-4">
            <thead>
              <tr className="bg-gray-100">
                {Object.keys(result[0]).map((key) => (
                  <th key={key} className="border px-4 py-2 text-left">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  {Object.values(row).map((val, i) => (
                    <td key={i} className="border px-4 py-2">
                      {val?.toString() ?? "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {result.length === 0 && !loading && (
        <p className="text-gray-500 mt-4">No results to display</p>
      )}
    </div>
  );
}
