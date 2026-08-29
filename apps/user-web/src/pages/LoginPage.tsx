import { useState } from "react";
import { Card } from "../components/Card";
import { Navigate, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, loading, checkAuth } = useAuth();

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loadingLogin, setLoadingLogin] = useState(false);
  
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  if (loading) {
    return null;
  }

  if (user) {
    return <Navigate to="/attendance" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setSuccess(null);
    setLoadingLogin(true);

    try {
      await api.post("/auth/login", {
        email,
        password,
      });
      await checkAuth();
      navigate("/attendance");
    } catch (err: any) {
      setError(err.response?.data?.message || err.message  || "Authentication failed. Please check inputs.");
    } finally {
      setLoadingLogin(false);
    }
  };

  return (
    <div className="h-full min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <Card className="w-full max-w-xl p-6 flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-slate-800 text-center">Absenin</h2>
        
        {error && (
          <div className="bg-red-50 text-red-800 border border-red-200 p-2.5 rounded text-center font-sans text-sm font-semibold">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-800 border border-green-200 p-2.5 rounded text-center font-sans text-sm font-semibold">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-5">
          <div className="flex flex-col gap-1">
            <label className="font-mono text-[10px] uppercase font-bold">
              Email
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="johndoe"
              required
              className="border border-outline-variant rounded p-2 text-sm font-sans focus:outline-primary"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-mono text-[10px] text-on-surface-variant uppercase font-bold">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="border border-outline-variant rounded p-2 text-sm font-sans focus:outline-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loadingLogin}
            className="w-full bg-black text-white py-3 rounded-lg font-sans text-sm hover:bg-neutral-800 transition-colors font-semibold mt-2 cursor-pointer disabled:opacity-50"
          >
            {loadingLogin ? "PROCESSING..." : "LOGIN"}
          </button>
        </form>
        
      </Card>
    </div>
  );
}