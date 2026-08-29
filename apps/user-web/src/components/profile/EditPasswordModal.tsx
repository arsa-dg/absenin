import { useState } from "react";
import { Card } from "../Card";
import { api } from "../../lib/api";

interface EditPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

export function EditPasswordModal({
  isOpen,
  onClose,
  onSuccess,
}: EditPasswordModalProps) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setOldPassword("");
    setNewPassword("");
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await api.patch("/user/me/password", {
        oldPassword,
        newPassword,
      });
      onSuccess("Password berhasil diubah.");
      handleClose();
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Gagal mengubah password.";
      setError(Array.isArray(msg) ? msg.join(", ") : msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <Card className="w-full max-w-md p-6 flex flex-col gap-4 bg-white shadow-xl">
        <div className="text-center">
          <h3 className="text-lg font-bold text-slate-800">Ubah Password</h3>
        </div>

        {error && (
          <div className="bg-red-50 text-red-800 border border-red-200 p-2.5 rounded text-center font-sans text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-1">
            <label className="font-mono text-[10px] uppercase font-bold text-slate-600">
              Password Lama
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="border border-slate-300 rounded-lg p-2 text-sm font-sans focus:outline-slate-800"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-mono text-[10px] uppercase font-bold text-slate-600">
              Password Baru
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="border border-slate-300 rounded-lg p-2 text-sm font-sans focus:outline-slate-800"
            />
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-black text-white py-2.5 px-4 rounded-lg font-sans text-xs font-semibold hover:bg-neutral-800 transition cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "PROCESSING..." : "SIMPAN"}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 border border-slate-300 text-slate-700 py-2.5 px-4 rounded-lg font-sans text-xs font-semibold hover:bg-slate-100 transition cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}