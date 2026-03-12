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

  const { user_id, package_id } = body;

  if (!user_id || !package_id) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  // obtener info del paquete
  const { data: pack } = await supabase
    .from("packages")
    .select("*")
    .eq("id", package_id)
    .single();

  if (!pack) {
    return NextResponse.json({ error: "Paquete no encontrado" }, { status: 404 });
  }

  let remaining_predictions = null;
  let expires_at = null;

  if (pack.type === "consumable" || pack.type === "daily") {
    remaining_predictions = pack.total_predictions;
  }

  if (pack.type === "subscription") {
    expires_at = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toISOString();
  }

  await supabase.from("user_packages").insert({
    user_id,
    package_id,
    remaining_predictions,
    status: "active",
    expires_at,
  });

  return NextResponse.json({ success: true });

}