import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  const supabase = await createClient();

  // 🔐 1️⃣ Verificar usuario autenticado
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

  // 📦 2️⃣ Recoger datos del body
  const body = await req.json();

  const {
    racecourse,
    race_date,
    race_time,
    race,
    horse,
    odds,
    stake,
    analysis,
    type,
  } = body;

  if (!race_date || !race_time) {
    return NextResponse.json(
      { error: "Debes indicar fecha y hora de la carrera" },
      { status: 400 }
    );
  }

  // 🕒 3️⃣ Construir race_datetime correctamente
  const raceDateTimeSpain = new Date(`${race_date}T${race_time}:00`);

  if (isNaN(raceDateTimeSpain.getTime())) {
    return NextResponse.json(
      { error: "Fecha u hora inválida" },
      { status: 400 }
    );
  }

  const raceDateTimeUTC = raceDateTimeSpain.toISOString();

  // 🔒 NUEVO: BLOQUEAR DOS DAILY EL MISMO DÍA
  if (type === "daily") {

    const startOfDay = new Date(raceDateTimeSpain);
    startOfDay.setHours(0,0,0,0);

    const endOfDay = new Date(raceDateTimeSpain);
    endOfDay.setHours(23,59,59,999);

    const { data: existingDaily } = await supabase
      .from("predictions")
      .select("id")
      .eq("type", "daily")
      .gte("race_datetime", startOfDay.toISOString())
      .lte("race_datetime", endOfDay.toISOString())
      .maybeSingle();

    if (existingDaily) {
      return NextResponse.json(
        { error: "Ya existe una Apuesta del Día publicada hoy" },
        { status: 400 }
      );
    }
  }

  // 🏁 4️⃣ Insertar prediction
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
      race_datetime: raceDateTimeUTC,
      result: "pending",
    })
    .select()
    .single();

  if (insertError || !prediction) {
    return NextResponse.json(
      { error: insertError?.message || "Error al insertar prediction" },
      { status: 500 }
    );
  }

  // 👥 5️⃣ Obtener paquetes activos
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

  const assignments: any[] = [];
  const consumablePackages: any[] = [];
  const dailyPackages: any[] = [];

  // 🔎 6️⃣ Decidir asignaciones
  for (const up of userPackages || []) {

    const { data: pack } = await supabase
      .from("packages")
      .select("type")
      .eq("id", up.package_id)
      .single();

    if (!pack) continue;

    const packageType = pack.type;

    // 🎯 REGULAR
    if (type === "regular") {

      if (packageType === "consumable" && up.remaining_predictions > 0) {

        assignments.push({
          user_id: up.user_id,
          prediction_id: prediction.id,
          assigned_at: new Date().toISOString(),
        });

        consumablePackages.push(up);
      }

      if (packageType === "subscription") {

        assignments.push({
          user_id: up.user_id,
          prediction_id: prediction.id,
          assigned_at: new Date().toISOString(),
        });

      }

    }

    // 🎯 DAILY
    if (type === "daily") {

      if (packageType === "daily" && up.remaining_predictions > 0) {

        assignments.push({
          user_id: up.user_id,
          prediction_id: prediction.id,
          assigned_at: new Date().toISOString(),
        });

        dailyPackages.push(up);
      }

      if (packageType === "subscription") {

        assignments.push({
          user_id: up.user_id,
          prediction_id: prediction.id,
          assigned_at: new Date().toISOString(),
        });

      }

    }

  }

  // 📝 7️⃣ Insertar asignaciones
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

  // 🔻 8️⃣ Consumir CONSUMABLES
  for (const up of consumablePackages) {

    if (up.remaining_predictions > 0) {

      await supabase
        .from("user_packages")
        .update({
          remaining_predictions: up.remaining_predictions - 1,
        })
        .eq("id", up.id)
        .gt("remaining_predictions", 0);

    }

  }

  // 🔻 9️⃣ Consumir DAILY
  for (const up of dailyPackages) {

    await supabase
      .from("user_packages")
      .update({
        remaining_predictions: 0,
        status: "consumed",
      })
      .eq("id", up.id)
      .gt("remaining_predictions", 0);

  }

  return NextResponse.json({ success: true });
}