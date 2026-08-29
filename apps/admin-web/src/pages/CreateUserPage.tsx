import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "../components/Card";
import { api } from "../lib/api";
import type { User } from "../types/user";

export default function CreateUserPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        email,
        password,
        name,
        phone: phone ? phone : undefined,
        position: position ? position : undefined,
      };

      const res = await api.post<User>("/user", payload);
      navigate(`/user?id=${res.data.id}`);
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Gagal menambahkan user baru.";
      setError(Array.isArray(msg) ? msg.join(", ") : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex-1 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-6 flex flex-col gap-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Tambah User Baru
          </h2>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Masukkan data akun karyawan baru ke dalam sistem
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-800 border border-red-200 p-2.5 rounded text-center font-sans text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="font-mono text-[10px] uppercase font-bold text-slate-600">
                Nama Lengkap *
              </label>
              <input
                type="text"
                maxLength={30}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: John Doe"
                required
                className="border border-slate-300 rounded-lg p-2.5 text-xs font-sans bg-white focus:outline-slate-800"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-mono text-[10px] uppercase font-bold text-slate-600">
                Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@perusahaan.com"
                required
                className="border border-slate-300 rounded-lg p-2.5 text-xs font-sans bg-white focus:outline-slate-800"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-mono text-[10px] uppercase font-bold text-slate-600">
                Password *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                required
                className="border border-slate-300 rounded-lg p-2.5 text-xs font-sans bg-white focus:outline-slate-800"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-mono text-[10px] uppercase font-bold text-slate-600">
                Posisi / Jabatan (Opsional)
              </label>
              <input
                type="text"
                maxLength={30}
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Contoh: Staff HR"
                className="border border-slate-300 rounded-lg p-2.5 text-xs font-sans bg-white focus:outline-slate-800"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-mono text-[10px] uppercase font-bold text-slate-600">
                Nomor Telepon (Opsional)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Contoh: +628123456789"
                className="border border-slate-300 rounded-lg p-2.5 text-xs font-sans bg-white focus:outline-slate-800"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-black text-white py-2.5 px-4 rounded-lg font-sans text-xs font-semibold hover:bg-neutral-800 transition cursor-pointer disabled:opacity-50"
            >
              {loading ? "PROCESSING..." : "CREATE"}
            </button>
            <Link
              to="/user"
              className="flex-1 border border-slate-300 text-slate-700 py-2.5 px-4 rounded-lg font-sans text-xs font-semibold hover:bg-slate-100 text-center transition cursor-pointer"
            >
              Batal
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}