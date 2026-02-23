import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message, token } = body;

    // 🔒 1️⃣ Validación básica
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Captcha no válido" },
        { status: 400 }
      );
    }

    // 🔐 2️⃣ Verificación REAL con Cloudflare Turnstile
    const verifyResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${process.env.TURNSTILE_SECRET_KEY}&response=${token}`,
      }
    );

    const verifyData = await verifyResponse.json();

    if (!verifyData.success) {
      return NextResponse.json(
        { success: false, error: "Captcha inválido" },
        { status: 400 }
      );
    }

    // ✉️ 3️⃣ Email para ADMIN
    await resend.emails.send({
      from: "JR Racing Tips <onboarding@resend.dev>",
      to: "jllatchehorses@gmail.com",
      subject: "📩 Nuevo mensaje desde la web",
      html: `
        <div style="font-family: Arial, sans-serif; background:#0f172a; padding:40px;">
          <div style="max-width:600px; margin:0 auto; background:#1e293b; padding:30px; border-radius:10px; color:white;">
            
            <h2 style="color:#22c55e; margin-bottom:20px;">
              Nuevo mensaje recibido
            </h2>

            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>

            <div style="margin-top:20px; padding:15px; background:#0f172a; border-radius:8px;">
              <p style="margin:0;"><strong>Mensaje:</strong></p>
              <p style="margin-top:10px; color:#cbd5e1;">${message}</p>
            </div>

            <hr style="margin:30px 0; border:0; border-top:1px solid #334155;" />

            <p style="font-size:12px; color:#94a3b8;">
              Enviado automáticamente desde JR Racing Tips
            </p>

          </div>
        </div>
      `,
    });

    // ✉️ 4️⃣ Copia automática al USUARIO
    await resend.emails.send({
      from: "JR Racing Tips <onboarding@resend.dev>",
      to: email,
      subject: "Hemos recibido tu mensaje",
      html: `
        <div style="font-family: Arial, sans-serif; background:#0f172a; padding:40px;">
          <div style="max-width:600px; margin:0 auto; background:#1e293b; padding:30px; border-radius:10px; color:white;">
            
            <h2 style="color:#22c55e;">
              Gracias por contactar
            </h2>

            <p>Hola ${name},</p>

            <p>
              Hemos recibido tu mensaje correctamente y responderemos lo antes posible.
            </p>

            <div style="margin-top:20px; padding:15px; background:#0f172a; border-radius:8px;">
              <p style="margin:0; font-size:14px; color:#94a3b8;">
                Este es un correo automático de confirmación.
              </p>
            </div>

            <hr style="margin:30px 0; border:0; border-top:1px solid #334155;" />

            <p style="font-size:12px; color:#94a3b8;">
              JR Racing Tips
            </p>

          </div>
        </div>
      `,
    });

    // ✅ 5️⃣ Respuesta final
    return NextResponse.json({
      success: true,
      message: "Mensaje enviado correctamente",
    });

  } catch (error) {
    console.error("ERROR CONTACT API:", error);

    return NextResponse.json(
      { success: false, error: "Error enviando mensaje" },
      { status: 500 }
    );
  }
}