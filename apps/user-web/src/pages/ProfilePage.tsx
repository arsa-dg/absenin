import { useState, useRef, useEffect } from "react";
import { Card } from "../components/Card";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { EditPasswordModal } from "../components/profile/EditPasswordModal";

export default function ProfilePage() {
  const { user, checkAuth } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [phone, setPhone] = useState(user?.phone || "");
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [isEditProfileSubmit, setIsEditProfileSubmit] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setPhone(user?.phone || "");
  }, [user]);

  const handleEditPhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleEditPhotoSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(null);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.patch("/user/me/photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await checkAuth();
      setSuccess("Foto profil berhasil diperbarui.");
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Gagal mengunggah foto profil.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleEditProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setError(null);
    setSuccess(null);
    setPhone(user?.phone || "");
    setIsEditProfile(true);
  };

  const handleCancelEditProfile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditProfile(false);
    setPhone(user?.phone || "");
    setError(null);
  };

  const handleEditProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsEditProfileSubmit(true);

    try {
      await api.patch("/user/me", { phone });
      await checkAuth();
      setSuccess("Profil berhasil diperbarui.");
      setIsEditProfile(false);
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Gagal memperbarui profil.";
      setError(Array.isArray(msg) ? msg.join(", ") : msg);
    } finally {
      setIsEditProfileSubmit(false);
    }
  };

  return (
    <div className="h-full min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <Card className="w-full max-w-xl p-6 flex flex-col gap-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Profil Pengguna
          </h2>
        </div>

        {error && (
          <div className="bg-red-50 text-red-800 border border-red-200 p-2.5 rounded text-center font-sans text-xs font-semibold">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-800 border border-green-200 p-2.5 rounded text-center font-sans text-xs font-semibold">
            {success}
          </div>
        )}

        <div className="flex flex-col items-center gap-3">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-200 bg-slate-100 flex items-center justify-center shadow-sm">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.name || "User Avatar"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-slate-400 select-none">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </span>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleEditPhotoSubmit}
              accept="image/*"
              className="hidden"
            />
          </div>

          <button
            type="button"
            onClick={handleEditPhotoClick}
            disabled={isUploading}
            className="text-xs font-semibold text-slate-700 hover:text-black transition-colors px-3 py-1 border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer disabled:opacity-50"
          >
            {isUploading ? "Mengunggah..." : "Ubah Foto"}
          </button>
        </div>

        <form onSubmit={handleEditProfileSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 border border-slate-200/80 bg-slate-50/50 p-3 rounded-xl">
              <span className="font-mono text-[10px] uppercase font-bold text-slate-500">
                Nama Lengkap
              </span>
              <span className="font-sans text-sm font-semibold text-slate-800">
                {user?.name || "-"}
              </span>
            </div>

            <div className="flex flex-col gap-1 border border-slate-200/80 bg-slate-50/50 p-3 rounded-xl">
              <span className="font-mono text-[10px] uppercase font-bold text-slate-500">
                Email
              </span>
              <span className="font-sans text-sm font-semibold text-slate-800 break-all">
                {user?.email || "-"}
              </span>
            </div>

            <div className="flex flex-col gap-1 border border-slate-200/80 bg-slate-50/50 p-3 rounded-xl">
              <span className="font-mono text-[10px] uppercase font-bold text-slate-500">
                Posisi / Jabatan
              </span>
              <span className="font-sans text-sm font-semibold text-slate-800">
                {user?.position || "-"}
              </span>
            </div>

            <div className="flex flex-col gap-1 border border-slate-200/80 bg-slate-50/50 p-3 rounded-xl">
              <label className="font-mono text-[10px] uppercase font-bold text-slate-500">
                Nomor Telepon
              </label>
              {isEditProfile ? (
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contoh: +628123456789"
                  required
                  className="border border-slate-300 rounded-lg px-2.5 py-1 text-sm font-sans bg-white focus:outline-slate-800"
                />
              ) : (
                <span className="font-sans text-sm font-semibold text-slate-800">
                  {user?.phone || "-"}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            {isEditProfile ? (
              <>
                <button
                  type="submit"
                  disabled={isEditProfileSubmit}
                  className="flex-1 bg-black text-white py-2.5 px-4 rounded-lg font-sans text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isEditProfileSubmit ? "PROCESSING..." : "SUBMIT"}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEditProfile}
                  disabled={isEditProfileSubmit}
                  className="flex-1 border border-slate-300 text-slate-700 py-2.5 px-4 rounded-lg font-sans text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Batal
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleEditProfileClick}
                  className="flex-1 bg-black text-white py-2.5 px-4 rounded-lg font-sans text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Edit Profile
                </button>

                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="flex-1 border border-slate-300 text-slate-700 py-2.5 px-4 rounded-lg font-sans text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Edit Password
                </button>
              </>
            )}
          </div>
        </form>
      </Card>

      <EditPasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={(msg) => {
          setSuccess(msg);
          setError(null);
        }}
      />
    </div>
  );
}