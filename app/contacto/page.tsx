"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MessageCircle, Clock } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Turnstile } from "@marsidev/react-turnstile";

export default function Contacto() {
  return (
    <div className="min-h-screen bg-slate-900 text-white px-6 py-20">
      <div className="max-w-5xl mx-auto space-y-24">

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          <h1 className="text-4xl md:text-5xl font-bold">
            Contacto
          </h1>
          <p className="text-slate-300 max-w-3xl mx-auto text-lg">
            Si tienes cualquier duda sobre el proyecto o los paquetes disponibles,
            puedes contactar sin compromiso.
          </p>
        </motion.div>

        {/* CANALES */}
        <div className="grid md:grid-cols-3 gap-8">
          <ContactCard
            icon={<Mail size={22} />}
            title="Correo electrónico"
            content="jllatchehorses@gmail.com"
          />
          <ContactCard
            icon={<MessageCircle size={22} />}
            title="X (Twitter)"
            content="@jllatchehorses"
          />
          <ContactCard
            icon={<Phone size={22} />}
            title="WhatsApp Web"
            content="6xx xx xx xx"
          />
        </div>

        {/* HORARIO */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-slate-800 border border-slate-700 rounded-xl p-10 space-y-4"
        >
          <div className="flex items-center gap-3 text-green-400">
            <Clock size={22} />
            <h2 className="text-2xl font-semibold text-white">
              Horario de atención
            </h2>
          </div>

          <p className="text-slate-300">
            Lunes a sábado de 9:00h a 18:00h.
          </p>
        </motion.div>

        {/* FORMULARIO */}
        <ContactForm />

      </div>
    </div>
  );
}

function ContactCard({
  icon,
  title,
  content,
}: {
  icon: React.ReactNode;
  title: string;
  content: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-slate-800 border border-slate-700 rounded-xl p-8 space-y-4 hover:border-green-400 transition-all duration-300"
    >
      <div className="flex items-center gap-3 text-green-400">
        {icon}
        <h3 className="text-lg font-semibold text-white">
          {title}
        </h3>
      </div>
      <p className="text-slate-300 break-words">
        {content}
      </p>
    </motion.div>
  );
}

function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    accepted: false,
  });

  const [token, setToken] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : undefined;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      alert("Por favor verifica que no eres un robot.");
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          token,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        alert("Error: " + data.error);
        return;
      }

      alert("Mensaje enviado correctamente.");

      setFormData({
        name: "",
        email: "",
        message: "",
        accepted: false,
      });

      setToken(null);

    } catch (error) {
      alert("Error enviando formulario.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-slate-800 border border-slate-700 rounded-xl p-10 space-y-6"
    >
      <h2 className="text-2xl font-semibold text-white">
        Formulario de contacto
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        <input
          type="text"
          name="name"
          placeholder="Nombre"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-3 text-white"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-3 text-white"
        />

        <textarea
          name="message"
          placeholder="Mensaje"
          rows={5}
          required
          value={formData.message}
          onChange={handleChange}
          className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-3 text-white"
        />

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            name="accepted"
            required
            onChange={handleChange}
            className="mt-1"
          />
          <p className="text-sm text-slate-400">
            Acepto la{" "}
            <Link
              href="/politica-privacidad"
              className="text-green-400 hover:underline"
            >
              política de privacidad
            </Link>
            .
          </p>
        </div>

        <Turnstile
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
          onSuccess={(token) => setToken(token)}
        />

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 transition px-6 py-3 rounded-md font-medium"
        >
          Enviar mensaje
        </button>

      </form>
    </motion.div>
  );
}