import { redirect } from "next/navigation";
import { createClient } from "../../../../lib/supabaseServer";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .single();

  if (!user || profile?.role !== "admin") {
    redirect("/");
  }

  // CLIENTE

  const { data: client } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!client) {
    redirect("/admin/clients");
  }

  // PAQUETES CLIENTE

  const { data: packages } = await supabase
    .from("user_packages")
    .select(`
      id,
      remaining_predictions,
      created_at,
      status,
      expires_at,
      packages (
        name,
        type
      )
    `)
    .eq("user_id", id)
    .order("created_at", { ascending: false });

  // PAQUETES DISPONIBLES

  const { data: availablePackages } = await supabase
    .from("packages")
    .select("*")
    .order("price", { ascending: true });

  // PICKS

  const { data: predictions } = await supabase
    .from("user_predictions")
    .select(`
      id,
      assigned_at,
      predictions (
        horse,
        result,
        type
      )
    `)
    .eq("user_id", id)
    .order("assigned_at", { ascending: false });

  // PAGOS

  const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .eq("user_id", id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-3xl font-bold mb-10 text-green-400">
        Cliente — {client.nombre || client.email}
      </h1>

      <div className="space-y-12">

        {/* INFO CLIENTE */}

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">

          <h2 className="text-xl font-semibold mb-4">
            Información
          </h2>

          <div className="space-y-2 text-sm">

            <div>
              Email:
              <span className="text-slate-300 ml-2">
                {client.email || "No disponible"}
              </span>
            </div>

            <div>
              Registro:
              <span className="text-slate-300 ml-2">
                {new Date(client.created_at).toLocaleDateString("es-ES")}
              </span>
            </div>

            <div>
              Saldo:
              <span className="text-green-400 font-semibold ml-2">
                {Number(client.balance || 0).toFixed(2)} €
              </span>
            </div>

            <div>
              Rol:
              <span className="text-slate-300 ml-2">
                {client.role}
              </span>
            </div>

            <div>
              Estado:
              <span className={`ml-2 font-semibold ${
                client.banned ? "text-red-400" : "text-green-400"
              }`}>
                {client.banned ? "Usuario baneado" : "Activo"}
              </span>
            </div>

          </div>

        </div>


        {/* CONTROL USUARIO */}

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">

          <h2 className="text-xl font-semibold mb-4">
            🚫 Control de usuario
          </h2>

          <form
            action="/api/admin/ban-user"
            method="POST"
            className="flex gap-4 items-center"
          >

            <input type="hidden" name="user_id" value={id} />

            <input
              type="hidden"
              name="banned"
              value={client.banned ? "false" : "true"}
            />

            <button
              className={`px-4 py-2 rounded-lg font-semibold ${
                client.banned
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {client.banned ? "Desbanear usuario" : "Banear usuario"}
            </button>

          </form>

        </div>


        {/* DAR PAQUETE */}

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">

          <h2 className="text-xl font-semibold mb-4">
            🎁 Dar paquete manual
          </h2>

          <form
            action="/api/admin/give-package"
            method="POST"
            className="flex gap-4 items-center"
          >

            <input type="hidden" name="user_id" value={id} />

            <select
              name="package_id"
              className="p-2 bg-slate-800 border border-slate-700 rounded"
            >

              <option value="">
                Seleccionar paquete
              </option>

              {availablePackages?.map((p:any)=>(
                <option key={p.id} value={p.id}>
                  {p.name} ({p.price}€)
                </option>
              ))}

            </select>

            <button
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg font-semibold"
            >
              Asignar paquete
            </button>

          </form>

        </div>


        {/* HISTORIAL PAQUETES */}

        <div>

          <h2 className="text-xl font-semibold mb-4">
            📦 Historial de Paquetes
          </h2>

          {packages && packages.length > 0 ? (

            <div className="space-y-3">

              {packages.map((p: any) => (

                <div
                  key={p.id}
                  className="bg-slate-900 p-4 rounded-lg border border-slate-800 text-sm flex justify-between items-center"
                >

                  <div>

                    {p.packages?.name}

                    <div className="text-xs text-slate-500 mt-1">
                      {new Date(p.created_at).toLocaleDateString("es-ES")}
                    </div>

                  </div>

                  <div className="flex items-center gap-6">

                    <div className="font-semibold text-right">

                      {p.packages?.type === "consumable" &&
                        `${p.remaining_predictions} restantes`}

                      {p.packages?.type === "daily" &&
                        "Apuesta del día"}

                      {p.packages?.type === "subscription" &&
                        `Activo hasta ${new Date(p.expires_at).toLocaleDateString("es-ES")}`}

                    </div>

                    {p.status === "active" && (

                      <form
                        action="/api/admin/cancel-package"
                        method="POST"
                      >

                        <input
                          type="hidden"
                          name="user_package_id"
                          value={p.id}
                        />

                        <button
                          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-xs font-semibold"
                        >
                          Cancelar
                        </button>

                      </form>

                    )}

                  </div>

                </div>

              ))}

            </div>

          ) : (

            <p className="text-slate-500 text-sm">
              No tiene paquetes registrados.
            </p>

          )}

        </div>


        {/* PICKS */}

        <div>

          <h2 className="text-xl font-semibold mb-4">
            🏇 Picks Asignados
          </h2>

          {predictions && predictions.length > 0 ? (

            <div className="space-y-3">

              {predictions.map((p: any) => (

                <div
                  key={p.id}
                  className="bg-slate-900 p-4 rounded-lg border border-slate-800 text-sm flex justify-between items-center"
                >

                  <div>

                    <div className="font-semibold">
                      {p.predictions?.horse}
                    </div>

                    <div className="text-xs text-slate-500 mt-1">
                      {new Date(p.assigned_at).toLocaleDateString("es-ES")}
                    </div>

                    <div className="text-xs text-slate-400">
                      {p.predictions?.type === "daily"
                        ? "Apuesta del día"
                        : "Pronóstico"}
                    </div>

                  </div>

                  <span
                    className={`px-3 py-1 rounded text-xs font-semibold ${
                      p.predictions?.result === "won"
                        ? "bg-green-500"
                        : p.predictions?.result === "lost"
                        ? "bg-red-500"
                        : p.predictions?.result === "void"
                        ? "bg-yellow-500 text-black"
                        : "bg-slate-600"
                    }`}
                  >
                    {p.predictions?.result || "pending"}
                  </span>

                </div>

              ))}

            </div>

          ) : (

            <p className="text-slate-500 text-sm">
              No tiene picks asignados.
            </p>

          )}

        </div>


        {/* PAGOS */}

        <div>

          <h2 className="text-xl font-semibold mb-4">
            💳 Historial de Pagos
          </h2>

          {payments && payments.length > 0 ? (

            <div className="space-y-3">

              {payments.map((pay: any) => (

                <div
                  key={pay.id}
                  className="bg-slate-900 p-4 rounded-lg border border-slate-800 text-sm flex justify-between items-center"
                >

                  <div>

                    {pay.method === "saldo" && "Compra con saldo"}
                    {pay.method === "refund_saldo" && "Refund saldo"}
                    {pay.method === "stripe" && "Pago Stripe"}

                    <div className="text-xs text-slate-500 mt-1">
                      {new Date(pay.created_at).toLocaleDateString("es-ES")}
                    </div>

                  </div>

                  <span
                    className={`font-semibold ${
                      pay.method === "refund_saldo"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {pay.method === "refund_saldo" ? "+" : "-"}
                    {Number(pay.amount).toFixed(2)} €
                  </span>

                </div>

              ))}

            </div>

          ) : (

            <p className="text-slate-500 text-sm">
              No tiene pagos registrados.
            </p>

          )}

        </div>

      </div>

    </div>
  );
}