"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminUsersPage() {

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {

    const res = await fetch("/api/admin/get-users");
    const data = await res.json();

    setUsers(data.users || []);
    setLoading(false);
  }

  if (loading)
    return (
      <div className="p-10 text-white">
        Cargando usuarios...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-3xl font-bold mb-10 text-green-400">
        Panel Admin — Usuarios
      </h1>

      {users.length === 0 && (
        <p className="text-slate-400 mb-6">
          No hay usuarios registrados todavía.
        </p>
      )}

      <div className="space-y-4">

        {users.map((u:any) => (

          <Link
            key={u.id}
            href={`/admin/users/${u.id}`}
          >
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex justify-between items-center hover:border-green-500 transition cursor-pointer">

              <div>

                <h2 className="text-lg font-bold">
                  {u.email || `Usuario ${u.id.slice(0,6)}`}
                </h2>

                <p className="text-sm text-slate-400">
                  Registro: {new Date(u.created_at).toLocaleDateString("es-ES")}
                </p>

              </div>

              <div className="flex gap-10 text-sm">

                <div>
                  <p className="text-slate-400">Saldo</p>
                  <p className="font-semibold text-green-400">
                    {Number(u.balance || 0).toFixed(2)} €
                  </p>
                </div>

                <div>
                  <p className="text-slate-400">Paquetes activos</p>
                  <p className="font-semibold">
                    {u.active_packages}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400">Pronósticos</p>
                  <p className="font-semibold">
                    {u.predictions}
                  </p>
                </div>

              </div>

            </div>
          </Link>

        ))}

      </div>

    </div>
  );
}