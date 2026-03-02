import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabaseServer";
import LogoutButton from "../components/LogoutButton";
import AccordionSection from "../components/AccordionSection";
import PredictionCard from "../components/PredictionCard";

export default async function CuentaPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // =========================
  // PERFIL
  // =========================

  const { data: profile } = await supabase
    .from("profiles")
    .select("balance")
    .eq("id", user.id)
    .single();

  const balance = Number(profile?.balance || 0);

  // =========================
  // MOVIMIENTOS
  // =========================

  const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // =========================
  // 🔥 PRONÓSTICOS (CORREGIDO)
  // =========================

  const { data: userPredictions } = await supabase
    .from("user_predictions")
    .select(`
      id,
      predictions (
        id,
        horse,
        racecourse,
        race,
        odds,
        stake,
        description,
        result,
        race_datetime,
        type
      )
    `)
    .eq("user_id", user.id);

  const now = new Date();

  const activePredictions =
    userPredictions?.filter((item: any) => {
      const p = item.predictions;
      return (
        p &&
        p.result === "pending" &&
        p.race_datetime &&
        new Date(p.race_datetime) > now
      );
    }) || [];

  const historyPredictions =
    userPredictions?.filter((item: any) => {
      const p = item.predictions;
      return p && p.result !== "pending";
    }) || [];

  // =========================
  // ESTADÍSTICAS
  // =========================

  const total = historyPredictions.length;

  const won = historyPredictions.filter(
    (p: any) => p.predictions.result === "won"
  ).length;

  const lost = historyPredictions.filter(
    (p: any) => p.predictions.result === "lost"
  ).length;

  const yieldEst =
    total > 0 ? (((won - lost) / total) * 100).toFixed(1) : "0";

  const lastMovement = payments?.[0];
  const hasActiveToday = activePredictions.length > 0;

  const whatsappUrl = `https://wa.me/34634031040?text=${encodeURIComponent(
    "Hola, tengo una consulta sobre mi cuenta en JR Racing Tips."
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
              Panel personal de JR Racing Tips
            </p>
          </div>
          <LogoutButton />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-14 space-y-14">

        {hasActiveToday && (
          <div className="bg-green-600/20 border border-green-500/40 p-6 rounded-xl">
            🟢 Tienes {activePredictions.length} pronóstico(s) en juego.
          </div>
        )}

        {/* SALDO */}
        <div className="bg-gradient-to-r from-green-600/20 to-green-500/10 border border-green-500/40 p-10 rounded-2xl shadow-lg">
          <h2 className="text-lg font-semibold text-green-400 mb-4">
            Saldo disponible
          </h2>

          <p className="text-4xl font-bold text-green-400">
            {balance.toFixed(2)}€
          </p>

          {lastMovement && (
            <p className="text-sm text-slate-400 mt-3">
              Último movimiento:{" "}
              {lastMovement.method === "refund_saldo" ? "+" : "-"}
              {Number(lastMovement.amount).toFixed(2)}€
            </p>
          )}
        </div>

        {/* ESTADÍSTICAS */}
        <div className="grid md:grid-cols-3 gap-6">
          <StatCard title="Total" value={total} />
          <StatCard title="Ganados" value={won} green />
          <StatCard title="Yield" value={`${yieldEst}%`} />
        </div>

        {/* PRONÓSTICOS ACTIVOS */}
        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-md">
          <h2 className="text-lg font-semibold mb-6 text-green-400">
            Pronósticos Activos ({activePredictions.length})
          </h2>

          {activePredictions.length ? (
            <div className="space-y-5">
              {activePredictions.map((item: any) => (
                <PredictionCard
                  key={item.predictions.id}
                  prediction={item.predictions}
                />
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm">
              No tienes pronósticos activos.
            </p>
          )}
        </div>

        {/* HISTORIAL */}
        <AccordionSection title="Historial completo">
          {historyPredictions.map((item: any) => {
            const p = item.predictions;

            return (
              <div
                key={p.id}
                className="flex justify-between items-center bg-slate-800/60 p-4 rounded-lg border border-slate-700"
              >
                <span>
                  🐎 {p.horse} — {p.racecourse}
                </span>

                <span
                  className={`font-semibold ${
                    p.result === "won"
                      ? "text-green-400"
                      : p.result === "lost"
                      ? "text-red-400"
                      : "text-yellow-400"
                  }`}
                >
                  {p.result === "won" && "Ganado"}
                  {p.result === "lost" && "Perdido"}
                  {p.result === "void" && "Nulo"}
                </span>
              </div>
            );
          })}
        </AccordionSection>

        {/* SOPORTE */}
        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-md">
          <h2 className="text-lg font-semibold mb-6 text-green-400">
            Soporte
          </h2>

          <a
            href={whatsappUrl}
            target="_blank"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 transition px-6 py-3 rounded-lg font-semibold text-sm"
          >
            Contactar por WhatsApp
          </a>
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value, green }: any) {
  return (
    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-center">
      <p className="text-sm text-slate-400 mb-2">{title}</p>
      <p
        className={`text-2xl font-bold ${
          green ? "text-green-400" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}