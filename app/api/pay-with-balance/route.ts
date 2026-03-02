import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { assignActivePredictionsToUser } from "@/lib/assignPredictions";

export async function POST(req: Request) {

  // 🔐 Cliente normal SOLO para autenticar usuario
  const supabaseAuth = await createClient();

  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { packageId } = await req.json();

  if (!packageId) {
    return NextResponse.json({ error: "Paquete inválido" }, { status: 400 });
  }

  // 🔥 A partir de aquí usamos ADMIN (sin RLS)
  const supabase = supabaseAdmin;

  // 2️⃣ Obtener paquete
  const { data: pack, error: packError } = await supabase
    .from("packages")
    .select("*")
    .eq("id", packageId)
    .single();

  if (packError || !pack) {
    return NextResponse.json({ error: "Paquete no encontrado" }, { status: 404 });
  }

  // 3️⃣ Validar permitido para saldo
  const allowed =
    pack.type === "daily" ||
    pack.type === "subscription" ||
    (pack.type === "consumable" && pack.total_predictions >= 5);

  if (!allowed) {
    return NextResponse.json(
      { error: "Este paquete no puede pagarse con saldo." },
      { status: 403 }
    );
  }

  // 4️⃣ Obtener balance usuario
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("balance")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json(
      { error: "Perfil no encontrado" },
      { status: 404 }
    );
  }

  if (Number(profile.balance) < Number(pack.price)) {
    return NextResponse.json(
      { error: "Saldo insuficiente." },
      { status: 400 }
    );
  }

  // 5️⃣ Crear user_package
  const expiresAt =
    pack.type === "subscription"
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      : null;

  const { data: newUserPackage, error: userPackageError } = await supabase
    .from("user_packages")
    .insert({
      user_id: user.id,
      package_id: pack.id,
      remaining_predictions:
        pack.type === "consumable" || pack.type === "daily"
          ? pack.total_predictions
          : null,
      status: "active",
      expires_at: expiresAt,
    })
    .select()
    .single();

  if (userPackageError || !newUserPackage) {
    console.error("ERROR USER PACKAGE:", userPackageError);
    return NextResponse.json(
      { error: userPackageError?.message || "Error creando paquete" },
      { status: 500 }
    );
  }

  // 6️⃣ Registrar payment
  const { error: paymentError } = await supabase
    .from("payments")
    .insert({
      user_id: user.id,
      package_id: pack.id,
      amount: Number(pack.price),
      currency: "EUR",
      method: "saldo",
      status: "completed",
    });

  if (paymentError) {
    console.error("ERROR PAYMENT:", paymentError);

    await supabase
      .from("user_packages")
      .delete()
      .eq("id", newUserPackage.id);

    return NextResponse.json(
      { error: paymentError.message },
      { status: 500 }
    );
  }

  // 7️⃣ Restar saldo
  const newBalance = Number(profile.balance) - Number(pack.price);

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ balance: newBalance })
    .eq("id", user.id);

  if (updateError) {
    console.error("ERROR UPDATE BALANCE:", updateError);

    await supabase
      .from("payments")
      .delete()
      .eq("user_id", user.id)
      .eq("package_id", pack.id);

    await supabase
      .from("user_packages")
      .delete()
      .eq("id", newUserPackage.id);

    return NextResponse.json(
      { error: updateError.message },
      { status: 500 }
    );
  }

  // 8️⃣ Asignar y consumir paquete (usa ADMIN internamente)
  await assignActivePredictionsToUser(
    user.id,
    pack,
    newUserPackage.id
  );

  return NextResponse.json({ success: true });
}