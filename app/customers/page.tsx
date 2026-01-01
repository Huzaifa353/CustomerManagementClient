"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, Pen } from "lucide-react";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";

interface Customer {
  id: number;
  name: string;
  email: string;
  gender: string;
  country: string;
  department: string | null;
  designation: string | null;
  signup_date: string;
}

interface PaginatedResponse {
  data: Customer[];
  current_page: number;
  last_page: number;
  total: number;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const [countryFilter, setCountryFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    async function fetchCustomers() {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        query.append("page", page.toString());
        if (countryFilter) query.append("country", countryFilter);
        if (departmentFilter) query.append("department", departmentFilter);

        const res = await fetch(`http://localhost:8000/api/customers?${query.toString()}`);
        const data: PaginatedResponse = await res.json();

        setCustomers(data.data);
        setLastPage(data.last_page);
      } catch (error) {
        console.error("Failed to fetch customers", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCustomers();
  }, [page, countryFilter, departmentFilter]);

  const countries = useMemo(
    () => Array.from(new Set(customers.map(c => c.country))).sort(),
    [customers]
  );

  const departments = useMemo(
    () => Array.from(new Set(customers.map(c => c.department).filter(Boolean))).sort(),
    [customers]
  );

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(lastPage, p + 1));

  if (loading) return <div className="p-4">Loading customers...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">

      <button
        onClick={() => router.push("/")}
        className="btn-primary text-white font-semibold px-6 py-3 rounded-lg shadow-md transition transform hover:-translate-y-1"
      >
        Back to Dashboard
      </button>
      <h1 className="text-2xl font-bold">Customers</h1>

      {/* Filters */}
      <div className="flex gap-4">
        <select
          className="border rounded px-3 py-2"
          value={countryFilter}
          onChange={e => setCountryFilter(e.target.value)}
        >
          <option value="">All Countries</option>
          {countries.map(country => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        <select
          className="border rounded px-3 py-2"
          value={departmentFilter}
          onChange={e => setDepartmentFilter(e.target.value)}
        >
          <option value="">All Departments</option>
          {departments.map(dep => (
            <option key={dep} value={dep || "-"}>{dep}</option>
          ))}
        </select>

        <button
          onClick={() => router.push("/customers/add")}
          className="bg-green-900 hover:bg-green-800 w-full text-white font-semibold px-6 py-3 rounded-lg shadow-md transition transform hover:-translate-y-1"
        >
          Add Customer
        </button>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Designation</TableHead>
            <TableHead>Signup Date</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {customers.map(c => (
            <TableRow key={c.id}>
              <TableCell>{c.name}</TableCell>
              <TableCell>{c.email}</TableCell>
              <TableCell>{c.gender}</TableCell>
              <TableCell>{c.country}</TableCell>
              <TableCell>{c.department ?? "-"}</TableCell>
              <TableCell>{c.designation ?? "-"}</TableCell>
              <TableCell>{new Date(c.signup_date).toLocaleDateString()}</TableCell>
              <TableCell className="flex gap-1">
                <Link
                  href={`/customers/${c.id}`}
                  className="inline-flex items-center justify-center rounded-md p-2 hover:bg-muted"
                  title="View Profile"
                >
                  <Eye className="h-5 w-5" />
                </Link>
                <Link
                  href={`/customers/${c.id}/edit`}
                  className="inline-flex items-center justify-center rounded-md p-2 hover:bg-muted"
                  title="Edit Customer"
                >
                  <Pen className="h-5 w-5" />
                </Link>
              </TableCell>
            </TableRow>
          ))}

          {customers.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-6">
                No customers found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          className="btn-primary"
          onClick={handlePrev}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>
          Page {page} of {lastPage}
        </span>
        <button
          className="btn-primary"
          onClick={handleNext}
          disabled={page === lastPage}
        >
          Next
        </button>
      </div>
    </div>
  );
}
