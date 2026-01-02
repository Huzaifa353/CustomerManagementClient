import { notFound } from "next/navigation";
import Link from "next/link";

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

interface CustomerLog {
  id: number;
  action: string;
  ip_address: string;
  timestamp: string;
}

async function getCustomer(id: string): Promise<Customer | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/customers/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

async function getCustomerLogs(id: string): Promise<CustomerLog[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/customers/${id}/logs`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function CustomerProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const [customer, logs] = await Promise.all([
    getCustomer(id),
    getCustomerLogs(id),
  ]);
  console.log(customer, logs);

  if (!customer) notFound();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
    <Link
        href="/customers"
        className="btn-primary text-white font-semibold px-6 py-3 rounded-lg shadow-md transition transform hover:-translate-y-1 ml-auto"
        >
        Back to Customers
    </Link>
      <h1 className="text-3xl font-bold">Customer Profile</h1>
      
    <Link
        href={`/customers/${id}/edit`}
        className="bg-green-900 hover:bg-green-800 w-full text-white font-semibold px-6 py-3 rounded-lg shadow-md transition transform hover:-translate-y-1"
        >
        Edit Customer
    </Link>

      <div className="grid grid-cols-2 gap-4 border rounded-lg p-6">
        <ProfileItem label="Name" value={customer.name} />
        <ProfileItem label="Email" value={customer.email} />
        <ProfileItem label="Gender" value={customer.gender} />
        <ProfileItem label="Country" value={customer.country} />
        <ProfileItem label="Department" value={customer.department ?? "-"} />
        <ProfileItem label="Designation" value={customer.designation ?? "-"} />
        <ProfileItem
          label="Signup Date"
          value={new Date(customer.signup_date).toLocaleDateString()}
        />
      </div>

      {/* Logs Section */}
      <div>
        <h2 className="text-2xl font-semibold">Customer Logs</h2>
        {logs.length === 0 ? (
          <p className="text-gray-500 mt-2">No logs found for this customer.</p>
        ) : (
          <table className="w-full border-collapse border mt-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Action</th>
                <th className="border px-4 py-2 text-left">IP Address</th>
                <th className="border px-4 py-2 text-left">Created At</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className="border px-4 py-2">{log.action}</td>
                  <td className="border px-4 py-2">{log.ip_address}</td>
                  <td className="border px-4 py-2">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function ProfileItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
