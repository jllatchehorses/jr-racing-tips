import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabaseServer";
import LogoutButton from "../components/LogoutButton";

export default async function CuentaPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 🔹 Obtener paquetes del usuario (incluyendo status y expiración)
  const { data: userPackages } = await supabase
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
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const now = new Date();

  // 🔹 Separar activos e historial correctamente
  const activePackages =
    userPackages?.filter((p: any) => {
      if (p.status !== "active") return false;

      if (p.packages?.type === "subscription") {
        if (!p.expires_at) return false;
        return new Date(p.expires_at) > now;
      }

      if (p.packages?.type === "consumable") {
        return p.remaining_predictions > 0;
      }

      return false;
    }) || [];

  const historyPackages =
    userPackages?.filter((p: any) => {
      if (
        p.packages?.type === "subscription" &&
        p.expires_at &&
        new Date(p.expires_at) <= now
      ) {
        return true;
      }

      if (
        p.packages?.type === "consumable" &&
        p.remaining_predictions === 0
      ) {
        return true;
      }

      return false;
    }) || [];

  // 🔹 Obtener pronósticos asignados
  const { data: userPredictions } = await supabase
    .from("user_predictions")
    .select(`
      id,
      assigned_at,
      predictions (
        id,
        racecourse,
        race_time,
        race,
        horse,
        odds,
        stake,
        description,
        type,
        result,
        created_at
      )
    `)
    .eq("user_id", user.id)
    .order("assigned_at", { ascending: false });

  const phoneNumber = "34634031040";
  const message =
    "Hola, tengo una consulta sobre mi cuenta en JR Racing Tips.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* HEADER */}
      <div className="border-b border-slate-800 bg-slate-900/70 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              Bienvenido, {user.user_metadata?.nombre || "Usuario"}
            </h1>
            <p className="text-sm text-slate-400 mt-2">
              Gestiona tu cuenta y consulta tus pronósticos.
            </p>
          </div>
          <LogoutButton />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-14 space-y-12">

        {/* PAQUETES ACTIVOS */}
        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800">
          <h2 className="text-lg font-semibold mb-6 text-green-400">
            📦 Paquetes activos
          </h2>

          {activePackages.length > 0 ? (
            <div className="space-y-4 text-sm">
              {activePackages.map((p: any) => (
                <div
                  key={p.id}
                  className="flex justify-between items-center bg-slate-800/60 p-4 rounded-lg"
                >
                  <span>{p.packages?.name}</span>

                  {p.packages?.type === "consumable" && (
                    <span className="text-yellow-400 font-semibold">
                      {p.remaining_predictions} restantes
                    </span>
                  )}

                  {p.packages?.type === "subscription" && (
                    <span className="text-green-400 font-semibold">
                      Activo hasta{" "}
                      {new Date(p.expires_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm">
              No tienes paquetes activos.
            </p>
          )}
        </div>

        {/* HISTORIAL */}
        {historyPackages.length > 0 && (
          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800">
            <h2 className="text-lg font-semibold mb-6 text-slate-400">
              🧾 Historial de paquetes
            </h2>

            <div className="space-y-4 text-sm">
              {historyPackages.map((p: any) => (
                <div
                  key={p.id}
                  className="flex justify-between items-center bg-slate-800/40 p-4 rounded-lg opacity-70"
                >
                  <span>{p.packages?.name}</span>
                  <span className="text-red-400 font-semibold">
                    Finalizado
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PRONÓSTICOS */}
        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800">
          <h2 className="text-lg font-semibold mb-6 text-green-400">
            🏇 Pronósticos
          </h2>

          {userPredictions && userPredictions.length > 0 ? (
            <div className="space-y-6">
              {userPredictions.map((item: any) => {
                const p = item.predictions;

                return (
                  <div
                    key={item.id}
                    className="bg-slate-800/60 p-6 rounded-xl border border-slate-700"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-slate-400">
                        {new Date(p.created_at).toLocaleString()}
                      </span>

                      <span className="text-xs px-3 py-1 rounded-full bg-green-500 text-black">
                        {p.type === "daily"
                          ? "Apuesta del Día"
                          : "Pronóstico"}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold mb-2">
                      🐎 {p.horse}
                    </h3>

                    <div className="text-sm text-slate-300 space-y-1 mb-3">
                      <p>📍 {p.racecourse}</p>
                      <p>🏁 {p.race}</p>
                      <p>🕒 {p.race_time}</p>
                      <p>💰 Cuota: {p.odds}</p>
                      <p>📊 Stake: {p.stake}</p>
                    </div>

                    <div className="text-sm text-slate-400 border-t border-slate-700 pt-3">
                      {p.description}
                    </div>

                    <div className="mt-4 text-sm">
                      {p.result === "pending" && (
                        <span className="text-slate-400">
                          Resultado pendiente
                        </span>
                      )}
                      {p.result === "won" && (
                        <span className="text-green-400 font-semibold">
                          ✅ Ganado
                        </span>
                      )}
                      {p.result === "lost" && (
                        <span className="text-red-400 font-semibold">
                          ❌ Perdido
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-slate-400 text-sm">
              No tienes pronósticos disponibles.
            </p>
          )}
        </div>

        {/* SOPORTE */}
        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800">
          <h2 className="text-lg font-semibold mb-6 text-green-400">
            🛠️ Soporte
          </h2>

          <a
            href={whatsappUrl}
            target="_blank"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 transition px-6 py-3 rounded-lg font-semibold text-sm"
          >
            💬 Contactar por WhatsApp
          </a>
        </div>

      </div>
    </div>
  );
}