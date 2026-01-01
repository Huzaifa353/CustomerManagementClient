"use client";

import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const cards = [
    { label: "Customers", href: "/customers", description: "View and manage all customers" },
    { label: "SQL Queries", href: "/sql-query", description: "Run SQL queries on customer data" },
    { label: "MongoDB Queries", href: "/mongo-query", description: "Run MongoDB pipelines" },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 center-content pb-20">
      <h1 className="text-4xl font-bold">Customer Management Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-20">
        {cards.map((card) => (
          <div
            key={card.href}
            onClick={() => router.push(card.href)}
            className="cursor-pointer bg-gray-800 text-gray-100 rounded-lg p-6 shadow hover:shadow-lg transition duration-200 hover:scale-105"
          >
            <h2 className="text-2xl font-semibold mb-2">{card.label}</h2>
            <p className="text-gray-400">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
