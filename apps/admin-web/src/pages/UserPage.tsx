import { useEffect, useState } from "react";
import { Card } from "../components/Card";
import { api } from "../lib/api";
import type { FindAllUser, User } from "../types/user";
import { useSearchParams } from "react-router-dom";

export default function UserPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryUserId = searchParams.get("id");

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [isEditUser, setIsEditUser] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");

  const fetchUsers = async () => {
    setLoadingList(true);
    setError(null);
    try {
      const res = await api.get<FindAllUser>("/user");
      setUsers(res.data?.users || []);
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Gagal memuat daftar pengguna.";
      setError(Array.isArray(msg) ? msg.join(", ") : msg);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (queryUserId) {
      handleUserClick(queryUserId);
    }
  }, [queryUserId]);

  const handleUserClick = async (userId: string) => {
    setLoadingDetail(true);
    setError(null);
    setSuccess(null);
    setIsEditUser(false);
    try {
      const res = await api.get<User>(`/user/${userId}`);
      setSelectedUser(res.data);
      setName(res.data.name || "");
      setPhone(res.data.phone || "");
      setPosition(res.data.position || "");
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Gagal memuat detail pengguna.";
      setError(Array.isArray(msg) ? msg.join(", ") : msg);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleStartEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setError(null);
    setSuccess(null);
    setName(selectedUser?.name || "");
    setPhone(selectedUser?.phone || "");
    setPosition(selectedUser?.position || "");
    setIsEditUser(true);
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setName(selectedUser?.name || "");
    setPhone(selectedUser?.phone || "");
    setPosition(selectedUser?.position || "");
    setIsEditUser(false);
    setError(null);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const res = await api.patch<User>(`/user/${selectedUser.id}`, {
        name,
        phone,
        position,
      });

      setSelectedUser(res.data);
      setSuccess("Data pengguna berhasil diperbarui.");
      setIsEditUser(false);

      fetchUsers();
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Gagal memperbarui data pengguna.";
      setError(Array.isArray(msg) ? msg.join(", ") : msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToList = () => {
    setSelectedUser(null);
    setIsEditUser(false);
    setError(null);
    setSuccess(null);
    setSearchParams({});
  };

  const formatDate = (dateVal?: string | Date) => {
    if (!dateVal) return "-";
    return new Date(dateVal).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="h-full flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-6 flex flex-col gap-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            {selectedUser ? "Detail User" : "Daftar User"}
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

        {selectedUser ? (
          <form onSubmit={handleEditSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-200 bg-slate-100 flex items-center justify-center shadow-sm">
                {selectedUser.photoURL ? (
                  <img
                    src={selectedUser.photoURL}
                    alt={selectedUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-slate-400 select-none">
                    {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : "U"}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                  selectedUser.role === "ADMIN"
                    ? "bg-purple-100 text-purple-800 border border-purple-200"
                    : "bg-slate-100 text-slate-700 border border-slate-200"
                }`}
              >
                {selectedUser.role}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Nama Lengkap */}
              <div className="flex flex-col gap-1 border border-slate-200/80 bg-slate-50/50 p-3 rounded-xl">
                <label className="font-mono text-[10px] uppercase font-bold text-slate-500">
                  Nama Lengkap
                </label>
                {isEditUser ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="border border-slate-300 rounded-lg px-2.5 py-1 text-sm font-sans bg-white focus:outline-slate-800"
                  />
                ) : (
                  <span className="font-sans text-sm font-semibold text-slate-800">
                    {selectedUser.name || "-"}
                  </span>
                )}
              </div>

              {/* Email (Readonly) */}
              <div className="flex flex-col gap-1 border border-slate-200/80 bg-slate-50/50 p-3 rounded-xl">
                <span className="font-mono text-[10px] uppercase font-bold text-slate-500">
                  Email
                </span>
                <span className="font-sans text-sm font-semibold text-slate-800 break-all">
                  {selectedUser.email || "-"}
                </span>
              </div>

              {/* Posisi / Jabatan */}
              <div className="flex flex-col gap-1 border border-slate-200/80 bg-slate-50/50 p-3 rounded-xl">
                <label className="font-mono text-[10px] uppercase font-bold text-slate-500">
                  Posisi / Jabatan
                </label>
                {isEditUser ? (
                  <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="Contoh: Frontend Engineer"
                    className="border border-slate-300 rounded-lg px-2.5 py-1 text-sm font-sans bg-white focus:outline-slate-800"
                  />
                ) : (
                  <span className="font-sans text-sm font-semibold text-slate-800">
                    {selectedUser.position || "-"}
                  </span>
                )}
              </div>

              {/* Nomor Telepon */}
              <div className="flex flex-col gap-1 border border-slate-200/80 bg-slate-50/50 p-3 rounded-xl">
                <label className="font-mono text-[10px] uppercase font-bold text-slate-500">
                  Nomor Telepon
                </label>
                {isEditUser ? (
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Contoh: +628123456789"
                    className="border border-slate-300 rounded-lg px-2.5 py-1 text-sm font-sans bg-white focus:outline-slate-800"
                  />
                ) : (
                  <span className="font-sans text-sm font-semibold text-slate-800">
                    {selectedUser.phone || "-"}
                  </span>
                )}
              </div>

              {/* Terdaftar Sejak */}
              <div className="flex flex-col gap-1 border border-slate-200/80 bg-slate-50/50 p-3 rounded-xl">
                <span className="font-mono text-[10px] uppercase font-bold text-slate-500">
                  Terdaftar Sejak
                </span>
                <span className="font-sans text-sm font-semibold text-slate-800">
                  {formatDate(selectedUser.createdAt)}
                </span>
              </div>

              {/* Terakhir Diperbarui */}
              <div className="flex flex-col gap-1 border border-slate-200/80 bg-slate-50/50 p-3 rounded-xl">
                <span className="font-mono text-[10px] uppercase font-bold text-slate-500">
                  Terakhir Diperbarui
                </span>
                <span className="font-sans text-sm font-semibold text-slate-800">
                  {formatDate(selectedUser.updatedAt)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              {isEditUser ? (
                <>
                  <button
                    key="btn-submit-user"
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-black text-white py-2.5 px-4 rounded-lg font-sans text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? "PROCESSING..." : "SUBMIT"}
                  </button>
                  <button
                    key="btn-cancel-user"
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={isSubmitting}
                    className="flex-1 border border-slate-300 text-slate-700 py-2.5 px-4 rounded-lg font-sans text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Batal
                  </button>
                </>
              ) : (
                <>
                  <button
                    key="btn-start-edit"
                    type="button"
                    onClick={handleStartEdit}
                    className="flex-1 bg-black text-white py-2.5 px-4 rounded-lg font-sans text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    Edit User
                  </button>
                  <button
                    key="btn-back-user"
                    type="button"
                    onClick={handleBackToList}
                    className="flex-1 border border-slate-300 text-slate-700 py-2.5 px-4 rounded-lg font-sans text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Kembali ke Daftar
                  </button>
                </>
              )}
            </div>
          </form>
        ) : (
          /* View List */
          <div className="flex flex-col gap-2.5 max-h-[440px] overflow-y-auto pr-1">
            {loadingList || loadingDetail ? (
              <div className="py-12 text-center text-slate-400 font-sans text-xs">
                Memuat data pengguna...
              </div>
            ) : users.length === 0 ? (
              <div className="py-12 text-center text-slate-400 font-sans text-xs">
                Tidak ada pengguna yang ditemukan.
              </div>
            ) : (
              users.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleUserClick(item.id)}
                  className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50 hover:bg-slate-100/80 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center shrink-0 border border-slate-300/60">
                      {item.photoURL ? (
                        <img
                          src={item.photoURL}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-bold text-slate-600">
                          {item.name ? item.name.charAt(0).toUpperCase() : "U"}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-sans text-sm font-bold text-slate-800 truncate">
                        {item.name}
                      </span>
                      <span className="font-mono text-xs text-slate-500 truncate">
                        {item.position || item.email}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        item.role === "ADMIN"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {item.role}
                    </span>
                    <span className="font-sans text-xs font-bold text-slate-400">
                      &rarr;
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </Card>
    </div>
  );
}