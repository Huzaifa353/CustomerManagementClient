"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CustomerForm {
  name: string;
  email: string;
  gender: string;
  country: string;
  department?: string;
  designation?: string;
  signup_date: string;
}

export default function AddCustomerPage() {
  const [form, setForm] = useState<CustomerForm>({
    name: "",
    email: "",
    gender: "male",
    country: "",
    department: "",
    designation: "",
    signup_date: new Date().toISOString().slice(0, 10), // default today
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/customers`, {
        method: "POST",
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

      setSuccess("Customer created successfully!");
      setForm({
        name: "",
        email: "",
        gender: "male",
        country: "",
        department: "",
        designation: "",
        signup_date: new Date().toISOString().slice(0, 10),
      });
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button
        onClick={() => router.push("/customers")}
        className="btn-primary text-white font-semibold px-6 py-3 rounded-lg shadow-md transition transform hover:-translate-y-1"
      >
        Back to Customers
      </button>
      <h1 className="text-3xl font-bold mb-6">Add Customer</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}

        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

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

        <div>
          <label className="block font-medium">Country</label>
          <input
            type="text"
            name="country"
            value={form.country}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Department</label>
          <input
            type="text"
            name="department"
            value={form.department}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div>
          <label className="block font-medium">Designation</label>
          <input
            type="text"
            name="designation"
            value={form.designation}
            onChange={handleChange}
            className="input-field"
          />
        </div>

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

        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
        >
          {loading ? "Saving..." : "Add Customer"}
        </button>
      </form>
    </div>
  );
}
