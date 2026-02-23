export default function Home() {
  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      
      {/* Fondo imagen */}
     <div className="absolute inset-0">
  <img
    src="/hipodromo.jpg"
    alt="Hipódromo"
    className="w-full h-full object-cover"
  />


<div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/60 to-slate-900/80"></div>
      </div>

      {/* Contenido */}
      <div className="relative z-10">
        <h1 className="text-5xl font-bold mb-6 leading-tight text-white drop-shadow-lg">
  Análisis profesional de <span className="text-green-400">carreras de caballos</span>
</h1>

        <p className="max-w-2xl text-lg text-slate-300 mb-8">
          Sistema estructurado basado en lectura de mercado, variables técnicas y gestión de stake.
          Resultados públicos y enfoque a largo plazo.
        </p>

        <div className="flex gap-6 justify-center">
          <a
            href="/paquetes"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-md transition"
          >
            Ver paquetes
          </a>

        <a
  href="/estadisticas-auditadas"
  className="border border-white/40 text-white hover:border-green-400 hover:text-green-400 px-6 py-3 rounded-md transition"
>
  Ver Estadísticas auditadas
</a>
        </div>
      </div>

    </section>
  );
}