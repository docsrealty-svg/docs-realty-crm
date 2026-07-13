"use client";
import { useState } from "react";

// ─── Nav links ────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Servicios", href: "#servicios" },
  { label: "Cómo funciona", href: "#proceso" },
  { label: "Industrias", href: "#industrias" },
  { label: "Por qué nosotros", href: "#por-que" },
  { label: "Nosotros", href: "#nosotros" },
];

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS = [
  { value: "+80", label: "Negocios automatizados" },
  { value: "+16", label: "Rubros atendidos" },
  { value: "100%", label: "Implementación remota" },
  { value: "30 días", label: "Soporte incluido" },
];

const PAIN_POINTS = [
  {
    title: "Respondés consultas manualmente todo el día",
    desc: "Cada mensaje, cada seguimiento, cada respuesta depende de que alguien esté disponible en el momento.",
  },
  {
    title: "Los leads se enfrían porque nadie los sigue a tiempo",
    desc: "Un lead sin respuesta en la primera hora tiene 7 veces menos chances de convertir. El tiempo corre.",
  },
  {
    title: "Tu equipo pierde horas en tareas repetitivas",
    desc: "Cargar datos, enviar recordatorios, generar reportes — tiempo operativo que no genera valor.",
  },
  {
    title: "No sabés qué está pasando en tu negocio en tiempo real",
    desc: "Las métricas están en planillas, en la cabeza del equipo o directamente no existen.",
  },
  {
    title: "Querés crecer pero no podés contratar más personas",
    desc: "Cada cliente nuevo suma carga operativa. El modelo no escala sin agregar gente.",
  },
  {
    title: "Cuando alguien falta, el proceso se para",
    desc: "Tu operación depende de personas clave. Un día sin ellas y todo se atrasa.",
  },
];

const SERVICES = [
  {
    icon: "💬",
    title: "Asistente de ventas y atención 24/7",
    desc: "Un agente que atiende consultas, califica leads y hace seguimiento automático por WhatsApp y otros canales — sin que nadie lo opere.",
  },
  {
    icon: "⚙️",
    title: "Automatización de procesos internos",
    desc: "Reemplazamos tareas manuales repetitivas: facturación, onboarding de clientes, reportes periódicos, carga de datos.",
  },
  {
    icon: "🎯",
    title: "Captación y nutrición de leads",
    desc: "Sistema que captura contactos, los califica automáticamente y los nutre con mensajes personalizados según su comportamiento.",
  },
  {
    icon: "📊",
    title: "Análisis de datos y dashboards",
    desc: "Paneles en tiempo real que muestran el estado de tu operación, tus métricas clave y las oportunidades que hoy no estás viendo.",
  },
  {
    icon: "🔗",
    title: "Integración de herramientas",
    desc: "Conectamos lo que ya usás — CRM, WhatsApp Business, email, planillas, sistemas de turnos — para que todo trabaje junto.",
  },
  {
    icon: "📞",
    title: "Agentes de voz automatizados",
    desc: "Atención telefónica inteligente para responder preguntas frecuentes, confirmar citas y recopilar información sin intervención humana.",
  },
];

const PROCESS = [
  {
    step: "01",
    title: "Diagnóstico",
    desc: "Analizamos tu operación actual, identificamos los procesos que más tiempo consumen y dónde se está perdiendo dinero o clientes.",
  },
  {
    step: "02",
    title: "Diseño a medida",
    desc: "Diseñamos el sistema con los flujos que más impacto van a generar para tu negocio específico. Sin plantillas genéricas.",
  },
  {
    step: "03",
    title: "Implementación",
    desc: "Configuramos, probamos e integramos todo con tus herramientas actuales. Una automatización puntual puede estar lista en 7 días.",
  },
  {
    step: "04",
    title: "Acompañamiento",
    desc: "El primer mes de soporte está incluido siempre. Ajustamos, corregimos y te capacitamos hasta que el sistema corra solo.",
  },
];

const INDUSTRIES = [
  {
    title: "Salud y bienestar",
    examples: ["Clínicas y consultorios", "Psicólogos y nutricionistas", "Odontólogos y veterinarios", "Centros estéticos y spas"],
  },
  {
    title: "Gastronomía y hotelería",
    examples: ["Restaurantes y bares", "Hoteles y apart-hoteles", "Cafeterías y panaderías", "Catering y delivery"],
  },
  {
    title: "Educación y formación",
    examples: ["Academias e institutos", "Coaches y tutores particulares", "Centros de idiomas", "Capacitadoras corporativas"],
  },
  {
    title: "Retail y e-commerce",
    examples: ["Tiendas físicas y online", "Distribuidoras y mayoristas", "Franquicias", "Negocios de ropa y calzado"],
  },
  {
    title: "Servicios profesionales",
    examples: ["Estudios contables y legales", "Consultoras de gestión", "Agencias de marketing", "Escribanías y gestorías"],
  },
  {
    title: "Logística y transporte",
    examples: ["Empresas de transporte", "Courier y paquetería", "Mudanzas y fletes", "Operadores logísticos"],
  },
  {
    title: "Construcción y arquitectura",
    examples: ["Constructoras y contratistas", "Estudios de arquitectura", "Empresas de reformas", "Desarrolladores de obra"],
  },
  {
    title: "Turismo y eventos",
    examples: ["Agencias de viaje", "Operadores turísticos", "Organizadores de eventos", "Productoras y shows"],
  },
  {
    title: "Automotriz",
    examples: ["Concesionarias de autos", "Talleres mecánicos", "Alquiler de vehículos", "Talleres de chapa y pintura"],
  },
  {
    title: "Finanzas y seguros",
    examples: ["Aseguradoras y brokers", "Gestorías de créditos", "Asesores de inversión", "Fintech y préstamos"],
  },
  {
    title: "Tecnología y agencias",
    examples: ["Startups y SaaS", "Agencias digitales", "Estudios de diseño", "Desarrolladoras de software"],
  },
  {
    title: "Otros servicios",
    examples: ["Peluquerías y barberías", "Gimnasios y pilates", "Fotografía y video", "Servicios del hogar"],
  },
];

const WHY_US = [
  {
    title: "Entregamos funcionando",
    desc: "No te damos código ni manual de instrucciones. El sistema llega probado y operativo desde el día uno.",
  },
  {
    title: "Soluciones a medida",
    desc: "Analizamos tu operación y diseñamos para ella. No hay plantillas genéricas que no entienden tu negocio.",
  },
  {
    title: "Implementación en semanas",
    desc: "Una automatización puntual puede estar operativa en 7 días. Un sistema complejo, en 3 semanas.",
  },
  {
    title: "Sin agregar estructura",
    desc: "Más volumen con el mismo equipo. Los sistemas trabajan 24/7 sin que necesites contratar más personas.",
  },
  {
    title: "Enfoque en rentabilidad",
    desc: "Cada automatización tiene que ahorrarte tiempo, reducir costos o aumentar ventas. Si no hay impacto, no la implementamos.",
  },
  {
    title: "Acompañamiento real",
    desc: "El primer mes de soporte está incluido siempre. Ajustamos y capacitamos hasta que el sistema corra solo.",
  },
];

const TESTIMONIALS = [
  {
    quote: "Automatizamos el seguimiento de leads y dejamos de perder ventas por falta de respuesta. En el primer mes recuperamos la inversión.",
    author: "Dueño de centro estético, CABA",
  },
  {
    quote: "El asistente atiende las consultas de WhatsApp las 24 horas. Ahora nuestro equipo se enfoca en cerrar ventas, no en responder mensajes.",
    author: "Directora de academia de idiomas, Córdoba",
  },
  {
    quote: "Pasamos de manejar todo en planillas a tener un sistema que funciona solo. El tiempo que recuperamos lo pusimos en crecer.",
    author: "Gerente de empresa de logística, Rosario",
  },
];

const FAQS = [
  {
    q: "¿En cuánto tiempo puedo ver resultados?",
    a: "Las automatizaciones básicas — como atención por WhatsApp o seguimiento de leads — pueden estar operativas en 7 a 14 días. Para sistemas más complejos con múltiples integraciones, el tiempo típico es de 3 a 4 semanas. En todos los casos, el impacto se empieza a ver desde la primera semana de uso real.",
  },
  {
    q: "¿Trabajan con cualquier tipo de negocio?",
    a: "Trabajamos principalmente con Pymes y emprendedores de Latinoamérica que quieren optimizar su operación. No importa si es un consultorio, una tienda online, una agencia o una empresa de servicios — si hay procesos repetitivos, hay oportunidad de automatizar.",
  },
  {
    q: "¿Necesito conocimientos técnicos para usar el sistema?",
    a: "No. Nosotros nos encargamos de todo el setup, la integración y la configuración. Al momento de entregarte el sistema, ya funciona. Además, incluimos capacitación para que tu equipo sepa cómo operarlo desde el primer día.",
  },
  {
    q: "¿Qué pasa si ya uso herramientas como un CRM o WhatsApp Business?",
    a: "Perfecto. Trabajamos con las herramientas que ya tenés. La idea es que el sistema se integre a lo que ya existe, no reemplazarlo. Si tenés un CRM, WhatsApp Business, email o cualquier plataforma activa, la conectamos al flujo automatizado.",
  },
  {
    q: "¿Tienen precios fijos o depende de cada proyecto?",
    a: "Depende del alcance del proyecto. No publicamos tarifas porque cada automatización tiene complejidades distintas. Lo que sí garantizamos es transparencia: antes de empezar, tenés un presupuesto cerrado y claro, sin sorpresas. Pedí una llamada gratuita y te damos un número concreto.",
  },
  {
    q: "¿Qué incluye el soporte post-implementación?",
    a: "El primer mes de soporte está incluido en todos los proyectos. Durante ese período ajustamos, corregimos y optimizamos el sistema según el uso real. Después podés contratar soporte mensual o hacer consultas puntuales según necesites.",
  },
];

// ─── Componentes ──────────────────────────────────────────────────────────────

function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
      style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
    >
      <a href="#" className="text-base font-semibold tracking-tight" style={{ color: "#f5f5f7" }}>
        Automatizaciones Express
      </a>

      {/* Desktop */}
      <div className="hidden md:flex items-center gap-7">
        {NAV_LINKS.map((l) => (
          <a key={l.label} href={l.href} className="text-sm transition-colors hover:text-white" style={{ color: "#86868b" }}>
            {l.label}
          </a>
        ))}
        <a
          href="https://wa.me/5491172373729"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full px-5 py-2 text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: "#2997ff", color: "#fff" }}
        >
          Hablar con un experto
        </a>
      </div>

      {/* Mobile toggle */}
      <button className="md:hidden flex flex-col gap-1.5 p-1" onClick={() => setOpen(!open)} aria-label="Menú">
        <span className="block w-5 h-px" style={{ background: "#f5f5f7" }} />
        <span className="block w-5 h-px" style={{ background: "#f5f5f7" }} />
        <span className="block w-5 h-px" style={{ background: "#f5f5f7" }} />
      </button>

      {open && (
        <div
          className="absolute top-full left-0 right-0 flex flex-col gap-4 px-6 py-6 md:hidden"
          style={{ background: "#000", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          {NAV_LINKS.map((l) => (
            <a key={l.label} href={l.href} className="text-sm" style={{ color: "#86868b" }} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a
            href="https://wa.me/5491172373729"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full px-5 py-2.5 text-sm font-semibold text-center"
            style={{ background: "#2997ff", color: "#fff" }}
          >
            Hablar con un experto
          </a>
        </div>
      )}
    </nav>
  );
}

function Hero() {
  return (
    <section
      className="px-6 py-28 text-center mx-auto max-w-[900px]"
      style={{ minHeight: "80vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}
    >
      <p className="text-xs font-semibold tracking-widest mb-6" style={{ color: "#2997ff" }}>
        AGENCIA DE AUTOMATIZACIÓN CON IA · LATINOAMÉRICA
      </p>
      <h1 className="headline-xl mb-6" style={{ color: "#f5f5f7" }}>
        Automatizamos tu negocio con IA.
        <br />
        <span style={{ color: "#86868b" }}>Vos te enfocás en crecer.</span>
      </h1>
      <p className="text-xl mb-10 max-w-xl mx-auto" style={{ color: "#86868b", lineHeight: 1.6 }}>
        Diseñamos e implementamos sistemas de automatización para Pymes y emprendedores que quieren operar mejor, atender más rápido y escalar sin contratar más personas.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href="https://wa.me/5491172373729"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full px-8 py-4 text-base font-semibold transition-all hover:opacity-90"
          style={{ background: "#2997ff", color: "#fff" }}
        >
          Agendá una llamada gratuita
        </a>
        <a
          href="#servicios"
          className="rounded-full px-8 py-4 text-base font-semibold transition-all hover:bg-white hover:text-black"
          style={{ border: "1px solid rgba(255,255,255,0.2)", color: "#f5f5f7" }}
        >
          Ver soluciones
        </a>
      </div>
    </section>
  );
}

function StatsStrip() {
  return (
    <section style={{ borderTop: "1px solid rgba(255,255,255,0.08)", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "#000" }}>
      <div className="grid grid-cols-2 md:grid-cols-4 max-w-[980px] mx-auto">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className="flex flex-col items-center py-10 px-6"
            style={{ borderRight: i < 3 ? "1px solid rgba(255,255,255,0.08)" : undefined }}
          >
            <p className="text-4xl font-bold mb-1" style={{ color: "#2997ff", letterSpacing: "-0.02em" }}>
              {s.value}
            </p>
            <p className="text-sm text-center" style={{ color: "#86868b" }}>{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PainPoints() {
  return (
    <section className="py-24 px-6" style={{ background: "#0a0a0a" }}>
      <div className="mx-auto max-w-[980px]">
        <p className="text-xs font-semibold tracking-widest mb-3 text-center" style={{ color: "#86868b" }}>
          ¿TE ESTÁ PASANDO ESTO?
        </p>
        <h2 className="headline-lg text-center mb-4">
          Reconocés alguno de estos problemas.
        </h2>
        <p className="text-lg text-center mb-14 max-w-2xl mx-auto" style={{ color: "#86868b" }}>
          Son los mismos que tienen la mayoría de las Pymes antes de implementar un sistema de automatización con IA.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PAIN_POINTS.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl p-7 flex flex-col gap-3"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(245,99,0,0.10)" }}>
                <span style={{ color: "#f56300", fontSize: "15px", fontWeight: 700 }}>✕</span>
              </div>
              <h3 className="text-sm font-semibold leading-snug" style={{ color: "#d2d2d7" }}>{p.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#6e6e73" }}>{p.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <a
            href="https://wa.me/5491172373729"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full px-7 py-3 text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: "#2997ff", color: "#fff" }}
          >
            Hablemos — te mostramos cómo lo resolvemos
          </a>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="servicios" className="py-24 px-6" style={{ background: "#000", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="mx-auto max-w-[980px]">
        <p className="text-xs font-semibold tracking-widest mb-3 text-center" style={{ color: "#86868b" }}>
          QUÉ HACEMOS
        </p>
        <h2 className="headline-lg text-center mb-4">Soluciones que transforman tu operación.</h2>
        <p className="text-lg text-center mb-14 max-w-2xl mx-auto" style={{ color: "#86868b" }}>
          Diseñadas para Pymes y emprendedores que quieren hacer más con el mismo equipo.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl p-7 flex flex-col gap-4"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <span className="text-2xl">{s.icon}</span>
              <h3 className="text-base font-semibold" style={{ color: "#f5f5f7" }}>{s.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#86868b" }}>{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <a
            href="https://wa.me/5491172373729"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full px-7 py-3 text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: "#2997ff", color: "#fff" }}
          >
            Quiero una consultoría gratuita
          </a>
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section id="proceso" className="py-24 px-6" style={{ background: "#0a0a0a", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="mx-auto max-w-[980px]">
        <p className="text-xs font-semibold tracking-widest mb-3 text-center" style={{ color: "#86868b" }}>
          CÓMO TRABAJAMOS
        </p>
        <h2 className="headline-lg text-center mb-4">Un proceso claro, simple y orientado a resultados.</h2>
        <p className="text-lg text-center mb-16 max-w-2xl mx-auto" style={{ color: "#86868b" }}>
          Desde el primer diagnóstico hasta que el sistema corre solo.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {PROCESS.map((p) => (
            <div
              key={p.step}
              className="rounded-2xl p-7 flex flex-col gap-4"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <p className="text-4xl font-bold" style={{ color: "#2997ff", letterSpacing: "-0.03em" }}>{p.step}</p>
              <h3 className="text-base font-semibold" style={{ color: "#f5f5f7" }}>{p.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#6e6e73" }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Industries() {
  return (
    <section id="industrias" className="py-24 px-6" style={{ background: "#000", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="mx-auto max-w-[980px]">
        <p className="text-xs font-semibold tracking-widest mb-3 text-center" style={{ color: "#86868b" }}>
          PARA QUIÉN ES
        </p>
        <h2 className="headline-lg text-center mb-4">Si hay procesos en tu negocio, podemos automatizarlos.</h2>
        <p className="text-lg text-center mb-12 max-w-2xl mx-auto" style={{ color: "#86868b" }}>
          Trabajamos con Pymes y emprendedores de cualquier rubro. Si algo se repite en tu operación, hay una solución para eso.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {INDUSTRIES.map((ind) => (
            <div
              key={ind.title}
              className="rounded-xl p-5 flex flex-col gap-3"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <h3 className="text-sm font-semibold leading-tight" style={{ color: "#f5f5f7" }}>{ind.title}</h3>
              <div style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />
              <ul className="flex flex-col gap-1">
                {ind.examples.map((ex) => (
                  <li key={ex} className="text-xs leading-relaxed" style={{ color: "#6e6e73" }}>
                    · {ex}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="mt-8 rounded-2xl px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ background: "rgba(41,151,255,0.06)", border: "1px solid rgba(41,151,255,0.15)" }}
        >
          <div>
            <p className="text-base font-semibold" style={{ color: "#f5f5f7" }}>¿No ves tu rubro en la lista?</p>
            <p className="text-sm mt-1" style={{ color: "#86868b" }}>Consultanos igual. Si hay procesos repetitivos, hay automatización posible — sin importar el sector.</p>
          </div>
          <a
            href="https://wa.me/5491172373729"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full px-6 py-3 text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: "#2997ff", color: "#fff" }}
          >
            Consultanos
          </a>
        </div>
      </div>
    </section>
  );
}

function ResultsStrip() {
  return (
    <section className="py-20 px-6" style={{ background: "#0a0a0a", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="mx-auto max-w-[980px]">
        <p className="text-xs font-semibold tracking-widest mb-3 text-center" style={{ color: "#86868b" }}>
          QUÉ CAMBIA CON AUTOMATIZACIONES EXPRESS
        </p>
        <h2 className="headline-lg text-center mb-14">Resultados concretos, no promesas.</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { value: "−85%", label: "tiempo en atención y tareas repetitivas", detail: "Lo que antes tomaba horas, el sistema lo hace solo." },
            { value: "24/7", label: "disponibilidad sin intervención humana", detail: "Atendé consultas, agendá y hacé seguimiento mientras dormís." },
            { value: "+3×", label: "velocidad de respuesta a leads nuevos", detail: "Sin tiempo de espera. Respuesta inmediata, calificación automática." },
            { value: "0", label: "leads perdidos por falta de seguimiento", detail: "Cada contacto entra al sistema y recibe seguimiento automático." },
          ].map((b) => (
            <div
              key={b.value}
              className="rounded-2xl p-8 flex flex-col gap-3"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <p className="text-5xl font-bold leading-none" style={{ color: "#2997ff", letterSpacing: "-0.02em" }}>{b.value}</p>
              <p className="text-sm font-semibold" style={{ color: "#f5f5f7" }}>{b.label}</p>
              <p className="text-xs leading-relaxed" style={{ color: "#6e6e73" }}>{b.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  return (
    <section id="por-que" className="py-24 px-6" style={{ background: "#000", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="mx-auto max-w-[980px]">
        <p className="text-xs font-semibold tracking-widest mb-3 text-center" style={{ color: "#86868b" }}>
          POR QUÉ ELEGIRNOS
        </p>
        <h2 className="headline-lg text-center mb-4">No vendemos horas. Vendemos resultados.</h2>
        <p className="text-lg text-center mb-14 max-w-2xl mx-auto" style={{ color: "#86868b" }}>
          La diferencia entre una automatización que funciona y una que queda en el cajón está en el proceso y en el acompañamiento.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {WHY_US.map((w) => (
            <div
              key={w.title}
              className="rounded-2xl p-7 flex flex-col gap-3"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "rgba(41,151,255,0.15)" }}
                >
                  <span style={{ color: "#2997ff", fontSize: "11px" }}>✓</span>
                </div>
                <h3 className="text-sm font-semibold" style={{ color: "#f5f5f7" }}>{w.title}</h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "#6e6e73" }}>{w.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="py-24 px-6" style={{ background: "#0a0a0a", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="mx-auto max-w-[980px]">
        <p className="text-xs font-semibold tracking-widest mb-3 text-center" style={{ color: "#86868b" }}>
          LO QUE DICEN NUESTROS CLIENTES
        </p>
        <h2 className="headline-lg text-center mb-14">Resultados reales en negocios reales.</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.author}
              className="rounded-2xl p-8 flex flex-col gap-5"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <p className="text-3xl leading-none" style={{ color: "#2997ff" }}>"</p>
              <p className="text-sm leading-relaxed flex-1" style={{ color: "#d2d2d7" }}>{t.quote}</p>
              <p className="text-xs" style={{ color: "#6e6e73" }}>{t.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhoWeAre() {
  return (
    <section id="nosotros" className="py-24 px-6" style={{ background: "#000", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="mx-auto max-w-[980px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-xs font-semibold tracking-widest mb-4" style={{ color: "#86868b" }}>QUIÉNES SOMOS</p>
            <h2 className="headline-md mb-6">Somos tu equipo de automatización con IA.</h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: "#86868b" }}>
              Automatizaciones Express es una agencia especializada en diseñar e implementar sistemas de IA para Pymes y emprendedores de Latinoamérica. No vendemos tecnología por la tecnología — trabajamos con vos para resolver problemas concretos de operación, ventas y atención al cliente.
            </p>
            <p className="text-base leading-relaxed mb-8" style={{ color: "#86868b" }}>
              Cada proyecto comienza con un diagnóstico profundo de tu operación. No hay plantillas. Hay soluciones diseñadas para tu negocio específico.
            </p>
            <div className="flex flex-wrap gap-3">
              {["+80 negocios automatizados", "+16 rubros", "100% remoto", "LATAM"].map((b) => (
                <span
                  key={b}
                  className="rounded-full px-4 py-1.5 text-xs font-semibold"
                  style={{ background: "rgba(41,151,255,0.1)", color: "#2997ff", border: "1px solid rgba(41,151,255,0.2)" }}
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {[
              { label: "MISIÓN", text: "Brindar soluciones de IA que permitan a Pymes y emprendedores optimizar procesos, mejorar su rentabilidad y escalar sin aumentar su estructura." },
              { label: "VISIÓN", text: "Convertirnos en la agencia de referencia en automatización con IA para negocios de habla hispana, con foco en resultados concretos y acompañamiento real." },
              { label: "METODOLOGÍA", text: "Diagnóstico → diseño a medida → implementación → acompañamiento. Sin plantillas genéricas, sin promesas vacías." },
              { label: "COMPROMISO", text: "El primer mes de soporte incluido en todos los proyectos. Ajustamos hasta que el sistema funcione solo." },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl p-5 flex flex-col gap-2"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <p className="text-xs font-bold tracking-widest" style={{ color: "#2997ff" }}>{item.label}</p>
                <p className="text-sm leading-relaxed" style={{ color: "#86868b" }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="py-24 px-6" style={{ background: "#0a0a0a", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="mx-auto max-w-[700px]">
        <p className="text-xs font-semibold tracking-widest mb-3 text-center" style={{ color: "#86868b" }}>
          PREGUNTAS FRECUENTES
        </p>
        <h2 className="headline-lg text-center mb-14">Todo lo que necesitás saber antes de empezar.</h2>
        <div className="flex flex-col gap-3">
          {FAQS.map((f, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <button
                className="w-full text-left flex items-center justify-between gap-4 px-6 py-5"
                style={{ background: open === i ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)" }}
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="text-sm font-semibold" style={{ color: "#f5f5f7" }}>{f.q}</span>
                <span className="text-lg shrink-0" style={{ color: "#2997ff" }}>{open === i ? "−" : "+"}</span>
              </button>
              {open === i && (
                <div className="px-6 pb-5" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <p className="text-sm leading-relaxed" style={{ color: "#86868b" }}>{f.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="py-28 px-6 text-center" style={{ background: "#000", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="mx-auto max-w-[700px]">
        <h2 className="headline-lg mb-6">
          ¿Listo para automatizar tu negocio con IA?
        </h2>
        <p className="text-lg mb-10" style={{ color: "#86868b" }}>
          Agendá una llamada gratuita. Analizamos tu operación y te mostramos exactamente qué se puede automatizar, cuánto tiempo lleva y qué impacto tiene.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://wa.me/5491172373729"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full px-8 py-4 text-base font-semibold transition-all hover:opacity-90"
            style={{ background: "#2997ff", color: "#fff" }}
          >
            Agendá una llamada gratuita
          </a>
          <a
            href="mailto:info@automatizacionesexpress.com"
            className="rounded-full px-8 py-4 text-base font-semibold transition-all hover:bg-white hover:text-black"
            style={{ border: "1px solid rgba(255,255,255,0.2)", color: "#f5f5f7" }}
          >
            Enviarnos un email
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-6 py-16" style={{ background: "#000", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="mx-auto max-w-[980px]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <p className="text-sm font-semibold mb-3" style={{ color: "#f5f5f7" }}>Automatizaciones Express</p>
            <p className="text-xs leading-relaxed mb-4" style={{ color: "#6e6e73" }}>
              Soluciones de automatización con IA para Pymes y emprendedores de Latinoamérica.
            </p>
            <a
              href="https://wa.me/5491172373729"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold"
              style={{ color: "#2997ff" }}
            >
              WhatsApp: +54 9 11 7237-3729
            </a>
          </div>

          <div>
            <p className="text-xs font-semibold mb-4 tracking-widest" style={{ color: "#86868b" }}>SERVICIOS</p>
            <div className="flex flex-col gap-2">
              {["Asistente de ventas 24/7", "Automatización interna", "Captación de leads", "Dashboards y reportes", "Integración de sistemas", "Agentes de voz"].map((s) => (
                <a key={s} href="#servicios" className="text-xs hover:text-white transition-colors" style={{ color: "#6e6e73" }}>{s}</a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold mb-4 tracking-widest" style={{ color: "#86868b" }}>INDUSTRIAS</p>
            <div className="flex flex-col gap-2">
              {["Salud y bienestar", "Gastronomía y hotelería", "Educación y formación", "Retail y comercio", "Servicios profesionales", "Logística"].map((s) => (
                <a key={s} href="#industrias" className="text-xs hover:text-white transition-colors" style={{ color: "#6e6e73" }}>{s}</a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold mb-4 tracking-widest" style={{ color: "#86868b" }}>EMPRESA</p>
            <div className="flex flex-col gap-2">
              {[
                { label: "Quiénes somos", href: "#nosotros" },
                { label: "Cómo funciona", href: "#proceso" },
                { label: "Por qué elegirnos", href: "#por-que" },
                { label: "Preguntas frecuentes", href: "#faq" },
              ].map((l) => (
                <a key={l.label} href={l.href} className="text-xs hover:text-white transition-colors" style={{ color: "#6e6e73" }}>{l.label}</a>
              ))}
            </div>
          </div>
        </div>

        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          <p className="text-xs" style={{ color: "#6e6e73" }}>© 2025 Automatizaciones Express. Todos los derechos reservados.</p>
          <div className="flex flex-wrap gap-6">
            <a href="/privacidad" className="text-xs hover:text-white transition-colors" style={{ color: "#6e6e73" }}>Política de privacidad</a>
            <a href="/terminos" className="text-xs hover:text-white transition-colors" style={{ color: "#6e6e73" }}>Términos y condiciones</a>
            <a href="/" className="text-xs hover:text-white transition-colors" style={{ color: "#6e6e73" }}>Desarrollado por AE</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <StatsStrip />
      <PainPoints />
      <Services />
      <Process />
      <Industries />
      <ResultsStrip />
      <WhyUs />
      <Testimonials />
      <WhoWeAre />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
