import { createClient } from "../../../lib/supabaseServer";
import Link from "next/link";

export default async function AdminClientsPage() {

  const supabase = await createClient();

  // Obtener clientes
  const { data: clients } = await supabase
    .from("profiles")
    .select(`
      id,
      nombre,
      email,
      role,
      balance,
      created_at
    `)
    .order("created_at", { ascending: false });

  const clientsList = clients || [];

  return (
    <div>

      <h1 className="text-3xl font-bold mb-10 text-green-400">
        Clientes
      </h1>

      {/* BUSCADOR */}

      <div className="mb-8">
        <input
          type="text"
          placeholder="Buscar por email..."
          className="w-full md:w-1/3 p-3 rounded-lg bg-slate-900 border border-slate-700 focus:border-green-500 outline-none"
        />
      </div>

      {clientsList.length === 0 && (
        <p className="text-slate-500">
          No hay clientes registrados.
        </p>
      )}

      <div className="space-y-6">

        {clientsList.map((client: any) => (

          <ClientCard
            key={client.id}
            client={client}
            supabase={supabase}
          />

        ))}

      </div>

    </div>
  );
}



async function ClientCard({ client, supabase }: any) {

  // Paquetes activos
  const { count: activePackages } = await supabase
    .from("user_packages")
    .select("*", { count: "exact", head: true })
    .eq("user_id", client.id)
    .eq("status", "active");

  // Pronósticos recibidos
  const { count: predictions } = await supabase
    .from("user_predictions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", client.id);

  return (

    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-green-500 transition">

      <div className="flex justify-between items-center">

        <div>

          <h2 className="text-lg font-semibold">
            {client.nombre || "Sin nombre"}
          </h2>

          <p className="text-sm text-slate-400">
            {client.email}
          </p>

          <p className="text-xs text-slate-500 mt-1">
            Rol: {client.role}
          </p>

          <p className="text-xs text-slate-500">
            Registro: {new Date(client.created_at).toLocaleDateString("es-ES")}
          </p>

        </div>

        <Link
          href={`/admin/clients/${client.id}`}
          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-sm font-semibold"
        >
          Ver detalle
        </Link>

      </div>


      {/* MÉTRICAS CLIENTE */}

      <div className="grid grid-cols-3 gap-6 mt-5 text-sm">

        <div>
          <p className="text-slate-400">Saldo</p>
          <p className="font-semibold text-green-400">
            {Number(client.balance || 0).toFixed(2)} €
          </p>
        </div>

        <div>
          <p className="text-slate-400">Paquetes activos</p>
          <p className="font-semibold">
            {activePackages || 0}
          </p>
        </div>

        <div>
          <p className="text-slate-400">Pronósticos</p>
          <p className="font-semibold">
            {predictions || 0}
          </p>
        </div>

      </div>

    </div>

  );
}