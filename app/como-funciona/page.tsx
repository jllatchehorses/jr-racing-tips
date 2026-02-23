"use client";

import { useState } from "react";
import { Search, CheckCircle, Send, ChevronDown } from "lucide-react";

export default function ComoFunciona() {
  return (
    <div className="max-w-6xl mx-auto py-20 px-6 text-white">

      {/* HERO */}
      <div className="text-center mb-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Cómo funciona el proyecto
        </h1>
        <p className="text-slate-300 max-w-3xl mx-auto text-lg">
          Análisis profesional orientado a detectar valor real en el mercado.
          Selección rigurosa, gestión responsable y transparencia total.
        </p>
      </div>

      {/* PROCESO */}
      <div className="grid md:grid-cols-3 gap-8 mb-20">

        <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 hover:border-green-400 transition-all duration-300 hover:-translate-y-1">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Search className="text-green-400" size={20} />
            1. Análisis
          </h3>
          <p className="text-slate-300">
            Cada carrera se estudia en profundidad considerando superficie,
            distancia, forma, jockey, entrenador, peso y contexto general.
          </p>
        </div>

        <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 hover:border-green-400 transition-all duration-300 hover:-translate-y-1">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="text-green-400" size={20} />
            2. Selección
          </h3>
          <p className="text-slate-300">
            Solo se publican pronósticos cuando existe valor real.
            No hay número fijo de selecciones diarias.
          </p>
        </div>

        <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 hover:border-green-400 transition-all duration-300 hover:-translate-y-1">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Send className="text-green-400" size={20} />
            3. Publicación
          </h3>
          <p className="text-slate-300">
            Pronósticos publicados de lunes a sábado.
            Se evita el mercado dominical por su alta imprevisibilidad.
          </p>
        </div>

      </div>

      {/* MODALIDADES */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold mb-10 text-center">
          Modalidades de acceso
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 hover:border-green-400 transition-all duration-300 hover:-translate-y-1">
            <h3 className="text-xl font-semibold mb-4">
              Apuesta del día
            </h3>
            <p className="text-slate-300">
              Selección diaria con devolución del importe en caso de fallo.
            </p>
          </div>

          <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 hover:border-green-400 transition-all duration-300 hover:-translate-y-1">
            <h3 className="text-xl font-semibold mb-4">
              Picks sueltos
            </h3>
            <p className="text-slate-300">
              Acceso flexible sin suscripción mensual.
              Validez entre 48h y 5 días.
            </p>
          </div>

          <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 hover:border-green-400 transition-all duration-300 hover:-translate-y-1">
            <h3 className="text-xl font-semibold mb-4">
              Pack mensual
            </h3>
            <p className="text-slate-300">
              Acceso completo a todos los pronósticos publicados durante el mes.
            </p>
          </div>

        </div>
      </div>

      {/* JUEGO RESPONSABLE */}
      <div className="bg-slate-800 border border-slate-700 p-10 rounded-xl mb-24">
        <h2 className="text-2xl font-bold mb-4">
          Juego responsable
        </h2>
        <p className="text-slate-300">
          Las apuestas implican riesgo. Este proyecto promueve una gestión
          responsable y recomienda apostar únicamente con dinero que se esté
          dispuesto a perder.
        </p>
      </div>

           {/* FAQ */}
      <div className="mt-24 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">
          Preguntas frecuentes
        </h2>

        <FAQ />
      </div>

    </div>
  );
}

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "¿Se gana dinero siempre con los pronósticos?",
      answer:
        "No. Las apuestas implican riesgo y pueden existir rachas negativas incluso con análisis rigurosos. No existe ningún sistema que garantice beneficios constantes.",
    },
    {
      question: "¿Cuántos pronósticos se publican al día?",
      answer:
        "No hay un número fijo. La media puede situarse entre 4 y 6 selecciones, pero únicamente se publican cuando se detecta valor real.",
    },
    {
      question: "¿Qué es la Apuesta del día?",
      answer:
        "Es una selección especial publicada cuando se detectan condiciones óptimas. En caso de fallo, se devuelve el importe pagado por ese paquete.",
    },
    {
      question: "¿Puedo comprar pronósticos sin suscribirme?",
      answer:
        "Sí. Existen paquetes de pronósticos sueltos sin compromiso mensual, con validez limitada en el tiempo.",
    },
    {
      question: "¿Cómo y cuándo se envían los pronósticos?",
      answer:
        "Se envían por WhatsApp o correo electrónico con antelación suficiente para poder realizar la apuesta con tranquilidad.",
    },
    {
      question: "¿Qué stake se recomienda?",
      answer:
        "Cada pronóstico incluye un stake orientativo como referencia para la gestión de banca. Cada usuario debe adaptarlo a su situación personal.",
    },
    {
      question: "¿Hay pronósticos los domingos?",
      answer:
        "No. Se evita el mercado dominical debido a su alta imprevisibilidad y menor fiabilidad estadística.",
    },
    {
      question: "¿Existe compromiso de permanencia?",
      answer:
        "No. No existe obligación de permanencia. Cada usuario puede acceder al proyecto durante el tiempo que considere oportuno.",
    },
  ];

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={index}
            className="border border-slate-700 rounded-lg overflow-hidden bg-slate-800"
          >
            <button
              onClick={() =>
                setOpenIndex(isOpen ? null : index)
              }
              className="w-full flex justify-between items-center px-6 py-5 text-left text-lg font-medium hover:bg-slate-700 transition"
            >
              <span className="flex items-center gap-3">
                <span className="text-green-400 text-xl">●</span>
                {faq.question}
              </span>

              <ChevronDown
                className={`transition-transform duration-300 ${
                  isOpen ? "rotate-180 text-green-400" : ""
                }`}
              />
            </button>

            <div
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-6 pb-6 text-slate-300">
                  {faq.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}