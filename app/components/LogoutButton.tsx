"use client";

import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-600 transition px-6 py-3 rounded-lg font-semibold text-sm"
    >
      Cerrar sesión
    </button>
  );
}