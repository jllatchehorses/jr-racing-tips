import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  const body = await req.json();

  const {
    racecourse,
    race_time,
    race,
    horse,
    odds,
    stake,
    analysis,
    type,
  } = body;

  // 1️⃣ Insertar prediction
  const { data: prediction, error: insertError } = await supabase
    .from("predictions")
    .insert({
      racecourse,
      race_time,
      race,
      horse,
      odds: odds ? parseFloat(odds) : null,
      stake,
      description: analysis,
      type,
    })
    .select()
    .single();

  if (insertError || !prediction) {
    return NextResponse.json(
      { error: insertError?.message || "Error al insertar prediction" },
      { status: 500 }
    );
  }

  // 2️⃣ Obtener user_packages activos y no vencidos
const { data: userPackages, error: usersError } = await supabase
  .from("user_packages")
  .select("*")
  .eq("status", "active")
  .or("expires_at.is.null,expires_at.gt.now()");

  if (usersError) {
    return NextResponse.json(
      { error: usersError.message },
      { status: 500 }
    );
  }

  const usersToAssign: string[] = [];

  for (const up of userPackages || []) {
    // Obtener tipo de paquete manualmente
    const { data: pack } = await supabase
      .from("packages")
      .select("type")
      .eq("id", up.package_id)
      .single();

    if (!pack) continue;

    const packageType = pack.type;

    // REGULAR
    if (type === "regular") {
      if (packageType === "consumable" && up.remaining_predictions > 0) {
        usersToAssign.push(up.user_id);
      }

      if (packageType === "subscription") {
        usersToAssign.push(up.user_id);
      }
    }

    // DAILY
    if (type === "daily") {
      if (packageType === "daily") {
        usersToAssign.push(up.user_id);
      }

      if (packageType === "subscription") {
        usersToAssign.push(up.user_id);
      }
    }
  }

  // 3️⃣ Asignar prediction
  const assignments = usersToAssign.map((userId) => ({
    user_id: userId,
    prediction_id: prediction.id,
  }));

  if (assignments.length > 0) {
    const { error: assignError } = await supabase
      .from("user_predictions")
      .insert(assignments);

    if (assignError) {
      return NextResponse.json(
        { error: assignError.message },
        { status: 500 }
      );
    }
  }

  // 4️⃣ Descontar consumibles si es regular
  if (type === "regular") {
    await supabase.rpc("consume_prediction_for_users");
  }

  return NextResponse.json({ success: true });
}