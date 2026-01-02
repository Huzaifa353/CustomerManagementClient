"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface CustomerForm {
  name: string;
  email: string;
  gender: string;
  country: string;
  department?: string;
  designation?: string;
  signup_date: string;
}

export default function EditCustomerPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [form, setForm] = useState<CustomerForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch customer
  useEffect(() => {
    async function fetchCustomer() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/customers/${id}`);
        if (!res.ok) throw new Error("Customer not found");

        const data = await res.json();
        setForm({
          ...data,
          signup_date: data.signup_date.slice(0, 10),
        });
      } catch (err) {
        setError("Failed to load customer");
      } finally {
        setLoading(false);
      }
    }

    fetchCustomer();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => prev && { ...prev, [name]: value });
  };

  async function logCustomerAction(customerId: number, action: string, metadata: any = {}) {
    try {
      await fetch(`http://localhost:8000/api/customers/${customerId}/log`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,       // e.g., "create", "update", "view"
          ip_address: window?.location?.hostname || "unknown", // example, you can get real IP on server
          device: navigator.userAgent,
          metadata
        }),
      });
    } catch (err) {
      console.error("Failed to log customer action", err);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`http://localhost:8000/api/customers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.errors) {
            // If Laravel returns field-specific errors
            setError(Object.values(data.errors).flat().join(", "));
        } else {
            setError(data.message || "Failed to create customer");
        }
        return;
      }

      setSuccess("Customer updated successfully!");
      setTimeout(() => router.push(`/customers/${id}`), 1200);
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading customer...</div>;
  if (!form) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button
        onClick={() => router.push("/customers")}
        className="btn-primary text-white font-semibold px-6 py-3 rounded-lg shadow-md transition transform hover:-translate-y-1"
      >
        Back to Customers
      </button>
      <h1 className="text-3xl font-bold mb-6">Edit Customer</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}

        <Input label="Name" name="name" value={form.name} onChange={handleChange} />
        <Input label="Email" name="email" value={form.email} onChange={handleChange} />

        <div>
          <label className="block font-medium">Gender</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="input-field"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <Input label="Country" name="country" value={form.country} onChange={handleChange} />
        <Input label="Department" name="department" value={form.department ?? ""} onChange={handleChange} />
        <Input label="Designation" name="designation" value={form.designation ?? ""} onChange={handleChange} />

        <div>
          <label className="block font-medium">Signup Date</label>
          <input
            type="date"
            name="signup_date"
            value={form.signup_date}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? "Updating..." : "Update Customer"}
        </button>
      </form>
    </div>
  );
}

function Input({
  label,
  ...props
}: {
  label: string;
  name: string;
  value: string;
  onChange: any;
}) {
  return (
    <div>
      <label className="block font-medium">{label}</label>
      <input {...props} className="input-field" />
    </div>
  );
}
