import { createClient } from "../../lib/supabaseServer";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const now = new Date();

  const startOfDay = new Date();
  startOfDay.setHours(0,0,0,0);

  const endOfDay = new Date();
  endOfDay.setHours(23,59,59,999);

  // 📊 MÉTRICAS GENERALES

  const { count: totalUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  const { count: totalPredictions } = await supabase
    .from("predictions")
    .select("*", { count: "exact", head: true });

  const { count: pendingPredictions } = await supabase
    .from("predictions")
    .select("*", { count: "exact", head: true })
    .eq("result", "pending");

  // 📊 OPERATIVA DEL DÍA

  const { count: todayPredictions } = await supabase
    .from("predictions")
    .select("*", { count: "exact", head: true })
    .gte("race_datetime", startOfDay.toISOString())
    .lte("race_datetime", endOfDay.toISOString());

  const { count: dailyToday } = await supabase
    .from("predictions")
    .select("*", { count: "exact", head: true })
    .eq("type", "daily")
    .gte("race_datetime", startOfDay.toISOString())
    .lte("race_datetime", endOfDay.toISOString());

  const { count: racesInPlay } = await supabase
    .from("predictions")
    .select("*", { count: "exact", head: true })
    .eq("result", "pending")
    .lte("race_datetime", now.toISOString());

  const { data: activeUsersToday } = await supabase
    .from("user_predictions")
    .select("user_id,predictions!inner(race_datetime)")
    .gte("predictions.race_datetime", startOfDay.toISOString())
    .lte("predictions.race_datetime", endOfDay.toISOString());

  const usersToday =
    new Set(activeUsersToday?.map((u:any)=>u.user_id)).size || 0;

  // 💰 MÉTRICAS FINANCIERAS

  const { data: allPayments } = await supabase
    .from("payments")
    .select("amount")
    .eq("status", "completed");

  const totalIncome =
    allPayments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0,0,0,0);

  const { data: monthlyPayments } = await supabase
    .from("payments")
    .select("amount")
    .eq("status", "completed")
    .gte("created_at", startOfMonth.toISOString());

  const monthlyIncome =
    monthlyPayments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

  const { count: activeSubscriptions } = await supabase
    .from("user_packages")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")
    .not("expires_at", "is", null)
    .gt("expires_at", new Date().toISOString());

  const { count: completedPayments } = await supabase
    .from("payments")
    .select("*", { count: "exact", head: true })
    .eq("status", "completed");

  return (
    <div>

      <h1 className="text-3xl font-bold mb-8 text-green-400">
        Dashboard Admin
      </h1>

      {/* 🔹 NAVEGACIÓN ADMIN */}

      <div className="flex gap-4 mb-12">

        <Link href="/admin/predictions">
          <button className="bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-lg border border-slate-700 transition">
            Pronósticos
          </button>
        </Link>

        <Link href="/admin/users">
          <button className="bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-lg border border-slate-700 transition">
            Usuarios
          </button>
        </Link>

      </div>

      {/* MÉTRICAS GENERALES */}

      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-8 mb-16">

        <Card title="Total Usuarios" value={totalUsers || 0} />

        <Card title="Total Pronósticos" value={totalPredictions || 0} />

        <Card title="Pendientes resultado" value={pendingPredictions || 0} />

        <Card title="Pronósticos Hoy" value={todayPredictions || 0} />

        <Card
          title="Daily Hoy"
          value={dailyToday ? "✔" : "❌"}
        />

        <Card
          title="En Juego"
          value={racesInPlay || 0}
        />

      </div>

      {/* ACTIVIDAD USUARIOS */}

      <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 mb-16">

        <Card
          title="Usuarios Activos Hoy"
          value={usersToday}
        />

      </div>

      {/* PANEL FINANCIERO */}

      <h2 className="text-2xl font-semibold mb-8 text-green-400">
        💰 Panel Financiero
      </h2>

      <div className="grid md:grid-cols-4 gap-8">

        <Card
          title="Ingresos Totales"
          value={`${totalIncome.toFixed(2)} €`}
          highlight
        />

        <Card
          title="Ingresos Mes Actual"
          value={`${monthlyIncome.toFixed(2)} €`}
          highlight
        />

        <Card
          title="Suscripciones Activas"
          value={activeSubscriptions || 0}
        />

        <Card
          title="Pagos Completados"
          value={completedPayments || 0}
        />

      </div>

    </div>
  );
}

function Card({
  title,
  value,
  highlight = false,
}: {
  title: string;
  value: any;
  highlight?: boolean;
}) {
  return (
    <div
      className={`bg-slate-900 p-8 rounded-xl border border-slate-800 transition-all duration-300 ${
        highlight
          ? "hover:border-green-500 hover:shadow-[0_0_25px_rgba(34,197,94,0.25)]"
          : ""
      }`}
    >
      <h2 className="text-lg text-slate-400 mb-2">
        {title}
      </h2>

      <p className="text-3xl font-bold text-green-400">
        {value}
      </p>
    </div>
  );
}