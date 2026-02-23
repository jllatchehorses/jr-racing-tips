"use client";

import { motion } from "framer-motion";
import { User, Target, Search, AlertTriangle, Shield, Users } from "lucide-react";

export default function Sobre() {
  return (
    <div className="min-h-screen bg-slate-900 text-white px-6 py-20">
      <div className="max-w-5xl mx-auto space-y-24 relative">

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          <h1 className="text-4xl md:text-5xl font-bold">
            Sobre el proyecto
          </h1>
          <p className="text-slate-300 max-w-3xl mx-auto text-lg">
            Un enfoque profesional, estructurado y transparente en el análisis de carreras de caballos.
          </p>
        </motion.div>

        <Section
          icon={<User size={22} />}
          title="Quién soy"
          content={`Más de 12 años en el mundo de las apuestas, especialización en caballos hace 8-9 años y experiencia previa gestionando grupos y servicios premium. Tras una pausa laboral, regreso con un proyecto sólido y estructurado.`}
        />

        <Section
          icon={<Target size={22} />}
          title="Qué es este proyecto"
          content={`No vende promesas irreales. Se basa en detectar valor real en cuotas mediante análisis detallado. Modalidades flexibles y enfoque en calidad sobre cantidad.`}
        />

        <Section
          icon={<Search size={22} />}
          title="Cómo analizo las carreras"
          content={`Entre 20 y 25 minutos por carrera. Variables técnicas, lectura de mercado, uso de herramientas especializadas e IA específica del sector.`}
        />

        <Section
          icon={<AlertTriangle size={22} />}
          title="La realidad de las apuestas"
          content={`Es un mercado volátil. Analizar bien no garantiza ganar siempre. Existen rachas negativas y la disciplina es clave.`}
        />

        <Section
          icon={<Shield size={22} />}
          title="Gestión de banca"
          content={`Cada pronóstico incluye stake recomendado. Apostar solo dinero dispuesto a perder y mantener coherencia en el largo plazo.`}
        />

        <Section
          icon={<Users size={22} />}
          title="Para quién es este proyecto"
          content={`Para personas con mentalidad de largo plazo y disciplina. No es para quienes buscan beneficios rápidos o garantías imposibles.`}
        />

      </div>
    </div>
  );
}

function Section({
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
      className="relative pl-10"
    >
      {/* Línea vertical elegante */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-green-500/30"></div>

      <div className="bg-slate-800 rounded-xl p-10 border border-slate-700 space-y-6 hover:border-green-400 transition-all duration-300">
        <div className="flex items-center gap-3 text-green-400">
          {icon}
          <h2 className="text-2xl font-semibold text-white">
            {title}
          </h2>
        </div>

        <p className="text-slate-300 leading-relaxed">
          {content}
        </p>
      </div>
    </motion.div>
  );
}