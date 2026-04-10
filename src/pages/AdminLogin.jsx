import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAppContext } from "../context/AppContext";
import { Eye, Loader2, ShieldCheck } from "lucide-react";

function AdminLogin() {
  const navigate = useNavigate();
  const { setUser } = useAppContext();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5001/api/doctors/login",
        form
      );

      console.log("LOGIN RESPONSE:", res.data);

      const { token, user } = res.data;

      // ✅ Admin check
      if (user.role !== "admin") {
        setError("Not authorized as admin");
        setLoading(false);
        return;
      }

      // ✅ Store token INSIDE user
      const userData = {
        ...user,
        token,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      navigate("/admin-dashboard");

    } catch (err) {
      console.log("LOGIN ERROR:", err);
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-indigo-100 px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Eye className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            Admin Portal
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Secure access to Admin Dashboard
          </p>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="w-full px-4 py-2.5 border rounded-lg"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="w-full px-4 py-2.5 border rounded-lg"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" />
                Signing In...
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                Login Securely
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;