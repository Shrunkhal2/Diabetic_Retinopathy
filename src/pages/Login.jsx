import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, ShieldCheck, Loader2 } from "lucide-react";
import axios from "axios";
import { useAppContext } from "../context/AppContext";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAppContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5001/api/doctors/login",
        { email, password }
      );

      // Validate response
      if (!res.data || !res.data.token || !res.data.user) {
        throw new Error("Invalid server response");
      }

      const { token, user } = res.data;

      // Role check
      if (user.role !== "doctor") {
        setError("Access denied: Doctor only");
        setLoading(false);
        return;
      }

      const userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: token,
      };

      // Save user
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      // ✅ ONLY redirect happens here (no useEffect)
      navigate("/dashboard", { replace: true });

    } catch (err) {
      console.log("LOGIN ERROR:", err);

      if (err.response?.status === 401) {
        setError("Invalid email or password");
      } else if (err.message === "Invalid server response") {
        setError("Server error: invalid response");
      } else {
        setError("Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-indigo-100 px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Eye className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            EyeCare Doctor Portal
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Secure access to Dashboard
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-70"
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

        {/* Admin Access */}
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate("/admin-login")}
            className="text-sm text-gray-600 hover:text-blue-600 underline"
          >
            Admin Access
          </button>
        </div>

      </div>
    </div>
  );
};

export default Login;