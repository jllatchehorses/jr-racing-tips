import { createClient } from "../../lib/supabaseServer";

export default async function AdminDashboard() {
  const supabase = await createClient();

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

  // 💰 MÉTRICAS FINANCIERAS

  // Ingresos totales históricos
  const { data: allPayments } = await supabase
    .from("payments")
    .select("amount")
    .eq("status", "completed");

  const totalIncome =
    allPayments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

  // Ingresos del mes actual
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { data: monthlyPayments } = await supabase
    .from("payments")
    .select("amount")
    .eq("status", "completed")
    .gte("created_at", startOfMonth.toISOString());

  const monthlyIncome =
    monthlyPayments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

  // Suscripciones activas
  const { count: activeSubscriptions } = await supabase
    .from("user_packages")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")
    .not("expires_at", "is", null)
    .gt("expires_at", new Date().toISOString());

  // Pagos completados
  const { count: completedPayments } = await supabase
    .from("payments")
    .select("*", { count: "exact", head: true })
    .eq("status", "completed");

  return (
    <div>
      <h1 className="text-3xl font-bold mb-12 text-green-400">
        Dashboard Admin
      </h1>

      {/* MÉTRICAS GENERALES */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">

        <Card title="Total Usuarios" value={totalUsers || 0} />

        <Card title="Total Pronósticos" value={totalPredictions || 0} />

        <Card title="Pendientes de resultado" value={pendingPredictions || 0} />

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