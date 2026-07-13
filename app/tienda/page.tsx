const LOGO_WA_PATH = "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z M11.5 2C6.262 2 2 6.262 2 11.5c0 1.614.417 3.13 1.144 4.448L2 22l6.188-1.114C9.447 21.574 10.456 22 11.5 22 16.738 22 21 17.738 21 12.5S16.738 2 11.5 2z";

const SYSTEMS = [
  {
    tag: "ANUNCIOS",
    headline: "Creación automática de anuncios con IA.",
    sub: "Copies, briefs y creatividades en segundos. Sin copywriters.",
    features: ["Copy para Meta Ads y Google", "Brief creativo listo para diseñador", "Variantes A/B en segundos"],
    price: "USD 59",
    href: "https://wa.me/5491172373729",
  },
  {
    tag: "LEADS",
    headline: "Captación de leads y emails automatizados.",
    sub: "Encuentra clientes potenciales y envíales mensajes personalizados.",
    features: ["Scraping de prospectos por rubro", "Email personalizado con IA", "Seguimiento automático a los 3 días"],
    price: "USD 59",
    href: "https://wa.me/5491172373729",
  },
  {
    tag: "SEO",
    headline: "SEO automatizado y reportes de marketing.",
    sub: "Audita sitios, genera informes y detecta oportunidades.",
    features: ["Auditoría técnica semanal", "Informe PDF automático", "Detección de keywords de competidores"],
    price: "USD 49",
    href: "https://wa.me/5491172373729",
  },
  {
    tag: "CRM",
    headline: "CRM local con IA para negocios chicos.",
    sub: "Pipeline, leads, scoring y acciones por WhatsApp. Sin suscripción mensual.",
    features: ["Pipeline visual en Notion o Airtable", "Scoring automático de leads", "Recordatorios por WhatsApp"],
    price: "USD 147",
    href: "https://wa.me/5491172373729",
  },
  {
    tag: "VIDEO",
    headline: "Kit editor de reels y videos con IA.",
    sub: "Subtítulos, guiones, layouts y piezas de venta para redes.",
    features: ["Guión con IA desde tu producto", "Subtítulos automáticos", "Piezas en formato Reels e Instagram"],
    price: "USD 97",
    href: "https://wa.me/5491172373729",
  },
  {
    tag: "GUÍA",
    headline: "Montá tu propio asistente IA personal.",
    sub: "PDF paso a paso para tener tu asistente conectado a voz, Telegram y apps.",
    features: ["Guía de instalación paso a paso", "Conexión a Telegram y voz", "Actualizable de por vida"],
    price: "USD 19",
    href: "https://wa.me/5491172373729",
  },
];

function SystemRow({ item }: { item: typeof SYSTEMS[0] }) {
  return (
    <article
      className="flex flex-col md:flex-row md:items-center gap-6 px-8 py-7"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="shrink-0 w-28">
        <span
          className="inline-block text-xs font-semibold tracking-widest px-2.5 py-1 rounded-full"
          style={{ background: "rgba(41,151,255,0.10)", color: "#2997ff" }}
        >
          {item.tag}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold mb-1" style={{ color: "#f5f5f7" }}>{item.headline}</h3>
        <p className="text-sm" style={{ color: "#86868b" }}>{item.sub}</p>
      </div>
      <ul className="flex flex-col gap-1.5 w-56 shrink-0">
        {item.features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-xs" style={{ color: "#86868b" }}>
            <span className="shrink-0 w-1 h-1 rounded-full" style={{ background: "#2997ff" }} />
            {f}
          </li>
        ))}
      </ul>
      <div className="shrink-0 flex items-center gap-4 md:gap-3 md:flex-col md:items-end lg:flex-row lg:items-center">
        <span className="text-sm font-semibold" style={{ color: "#f5f5f7" }}>{item.price}</span>
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold rounded-full px-4 py-2 transition-all hover:opacity-90 whitespace-nowrap"
          style={{ background: "#2997ff", color: "#fff" }}
        >
          Consultar ›
        </a>
      </div>
    </article>
  );
}

export default function Tienda() {
  return (
    <main className="min-h-screen" style={{ background: "#000" }}>
      {/* Nav */}
      <header
        className="sticky top-0 z-50 w-full"
        style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="mx-auto flex max-w-[980px] items-center justify-between px-5 py-0 h-12">
          <a href="/" className="text-sm font-semibold tracking-tight" style={{ color: "#f5f5f7" }}>
            ← Automatizaciones Express
          </a>
          <a
            href="https://wa.me/5491172373729"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold rounded-full px-4 py-1.5 transition-all"
            style={{ background: "#2997ff", color: "#fff" }}
          >
            Contactar
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-6 text-center" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="mx-auto max-w-[680px]">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6"
            style={{ background: "rgba(41,151,255,0.10)", border: "1px solid rgba(41,151,255,0.20)" }}
          >
            <p className="text-xs font-semibold tracking-widest" style={{ color: "#2997ff" }}>TIENDA DE FLUJOS</p>
          </div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: "#f5f5f7" }}>Para quienes instalan sus propios sistemas.</h1>
          <p className="text-lg mb-6" style={{ color: "#86868b" }}>
            Flujos individuales listos para instalar. Esta sección es para técnicos, freelancers y desarrolladores que ya saben lo que están haciendo.
          </p>
          {/* Disclaimer box */}
          <div
            className="rounded-2xl px-6 py-5 text-left"
            style={{ background: "rgba(245,99,0,0.07)", border: "1px solid rgba(245,99,0,0.18)" }}
          >
            <p className="text-sm font-semibold mb-2" style={{ color: "#f56300" }}>Antes de comprar, tené en cuenta:</p>
            <ul className="flex flex-col gap-1.5">
              {[
                "Requiere conocimiento técnico para instalar y configurar.",
                "Los costos de APIs y tokens (IA, WhatsApp, etc.) van aparte y dependen del uso.",
                "Si preferís que lo hagamos nosotros, escribinos — te cotizamos la implementación completa.",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm" style={{ color: "#86868b" }}>
                  <span style={{ color: "#f56300", marginTop: "1px" }}>·</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section className="py-12 px-6">
        <div className="mx-auto max-w-[980px]">
          <div
            style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", overflow: "hidden" }}
          >
            {SYSTEMS.map((item) => (
              <SystemRow key={item.tag} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA bottom */}
      <section
        className="py-16 px-6 text-center"
        style={{ background: "#0a0a0a", borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        <p className="text-base mb-2" style={{ color: "#86868b" }}>¿Preferís que lo hagamos nosotros?</p>
        <h2 className="text-2xl font-bold mb-6" style={{ color: "#f5f5f7" }}>Te automatizamos el negocio completo.</h2>
        <a
          href="/"
          className="inline-block rounded-full px-8 py-3.5 text-base font-semibold transition-all hover:opacity-90"
          style={{ background: "#2997ff", color: "#fff" }}
        >
          Ver planes de implementación ›
        </a>
      </section>

      {/* Footer */}
      <footer
        style={{ background: "#1d1d1f", borderTop: "1px solid rgba(255,255,255,0.08)" }}
        className="py-6 px-6 text-center"
      >
        <p className="text-xs" style={{ color: "#6e6e73" }}>
          Copyright © 2025 Automatizaciones Express · <a href="/" className="hover:text-white transition-colors">Volver al inicio</a>
          {" · "}
          <a href="/" className="hover:text-white transition-colors">Desarrollado por AE</a>
        </p>
      </footer>
    </main>
  );
}
