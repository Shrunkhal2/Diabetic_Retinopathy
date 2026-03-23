import { useEffect, useState } from "react";
import axios from "axios";
import { useAppContext } from "../context/AppContext";

function AdminDashboard() {
  const { user } = useAppContext();
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const fetchDoctors = async () => {
    const res = await axios.get("http://localhost:5000/api/admin/doctors", {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    setDoctors(res.data);
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    await axios.post(
      "http://localhost:5000/api/admin/doctors",
      form,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    setForm({ name: "", email: "", password: "" });
    fetchDoctors();
  };

  const handleDelete = async (id) => {
    await axios.delete(
      `http://localhost:5000/api/admin/doctors/${id}`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    fetchDoctors();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      {/* Create Doctor */}
      <form onSubmit={handleCreate} className="mb-6 space-y-2">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          className="border p-2 block"
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          className="border p-2 block"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          className="border p-2 block"
        />
        <button className="bg-blue-500 text-white px-4 py-2">
          Create Doctor
        </button>
      </form>

      {/* Doctor List */}
      <ul>
        {doctors.map((doc) => (
          <li
            key={doc._id}
            className="flex justify-between border p-2 mb-2"
          >
            {doc.name} ({doc.email})
            <button
              onClick={() => handleDelete(doc._id)}
              className="bg-red-500 text-white px-2"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;
