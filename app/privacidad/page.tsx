export default function Privacidad() {
  return (
    <main className="min-h-screen" style={{ background: "#000" }}>
      <header
        className="sticky top-0 z-50 w-full"
        style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="mx-auto flex max-w-[980px] items-center justify-between px-5 h-12">
          <a href="/" className="text-sm font-semibold tracking-tight" style={{ color: "#f5f5f7" }}>
            ← Automatizaciones Express
          </a>
        </div>
      </header>

      <section className="py-20 px-6">
        <div className="mx-auto max-w-[680px]">
          <h1 className="text-3xl font-bold mb-12" style={{ color: "#f5f5f7" }}>Política de privacidad</h1>

          <div className="flex flex-col gap-10" style={{ color: "#d2d2d7" }}>
            <div>
              <h2 className="text-base font-semibold mb-3" style={{ color: "#f5f5f7" }}>1. Quiénes somos</h2>
              <p className="text-sm leading-relaxed" style={{ color: "#86868b" }}>
                Automatizaciones Express es un servicio de implementación de sistemas de automatización e inteligencia artificial para negocios. Operamos de forma remota y atendemos clientes en Argentina y toda Latinoamérica. Contacto: expressautomatizaciones@gmail.com
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold mb-3" style={{ color: "#f5f5f7" }}>2. Qué datos recopilamos</h2>
              <p className="text-sm leading-relaxed mb-3" style={{ color: "#86868b" }}>
                Recopilamos únicamente los datos necesarios para brindar el servicio:
              </p>
              <ul className="flex flex-col gap-2">
                {[
                  "Nombre y datos de contacto (email, número de WhatsApp) que nos proporcionás voluntariamente al iniciar una consulta.",
                  "Información sobre tu negocio que compartís durante el proceso de relevamiento.",
                  "Datos de uso del sitio web mediante cookies de analítica (sin información personal identificable).",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm" style={{ color: "#86868b" }}>
                    <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full" style={{ background: "#2997ff", minWidth: "6px" }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-base font-semibold mb-3" style={{ color: "#f5f5f7" }}>3. Cómo usamos tus datos</h2>
              <p className="text-sm leading-relaxed" style={{ color: "#86868b" }}>
                Usamos tu información exclusivamente para responder tu consulta, diseñar e implementar el sistema automatizado contratado, y comunicarnos durante el proceso de entrega y soporte. No vendemos, alquilamos ni compartimos tu información con terceros salvo cuando sea estrictamente necesario para la ejecución del servicio (por ejemplo, plataformas de mensajería o herramientas de trabajo ya acordadas con vos).
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold mb-3" style={{ color: "#f5f5f7" }}>4. Almacenamiento y seguridad</h2>
              <p className="text-sm leading-relaxed" style={{ color: "#86868b" }}>
                Los datos de contacto se almacenan en herramientas de gestión interna con acceso restringido. Los sistemas implementados para tu negocio corren en las plataformas que acordamos y son de tu propiedad. No almacenamos datos de tus clientes finales en nuestros servidores.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold mb-3" style={{ color: "#f5f5f7" }}>5. Tus derechos</h2>
              <p className="text-sm leading-relaxed" style={{ color: "#86868b" }}>
                Podés solicitar en cualquier momento el acceso, rectificación o eliminación de tus datos personales escribiéndonos a expressautomatizaciones@gmail.com. Responderemos en un plazo máximo de 10 días hábiles.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold mb-3" style={{ color: "#f5f5f7" }}>6. Cookies</h2>
              <p className="text-sm leading-relaxed" style={{ color: "#86868b" }}>
                Este sitio puede usar cookies de analítica para entender el tráfico y mejorar la experiencia. No usamos cookies de seguimiento publicitario de terceros. Podés deshabilitar las cookies desde la configuración de tu navegador.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold mb-3" style={{ color: "#f5f5f7" }}>7. Cambios a esta política</h2>
              <p className="text-sm leading-relaxed" style={{ color: "#86868b" }}>
                Podemos actualizar esta política en cualquier momento. Los cambios se publicarán en esta página con la fecha de actualización. El uso continuado del servicio implica la aceptación de la política vigente.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold mb-3" style={{ color: "#f5f5f7" }}>8. Contacto</h2>
              <p className="text-sm leading-relaxed" style={{ color: "#86868b" }}>
                Para cualquier consulta sobre privacidad escribinos a{" "}
                <a href="mailto:expressautomatizaciones@gmail.com" className="hover:text-white transition-colors" style={{ color: "#2997ff" }}>
                  expressautomatizaciones@gmail.com
                </a>{" "}
                o por{" "}
                <a href="https://wa.me/5491172373729" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" style={{ color: "#2997ff" }}>
                  WhatsApp
                </a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer
        style={{ background: "#1d1d1f", borderTop: "1px solid rgba(255,255,255,0.08)" }}
        className="py-6 px-6 text-center"
      >
        <p className="text-xs" style={{ color: "#6e6e73" }}>
          Copyright © 2025 Automatizaciones Express ·{" "}
          <a href="/terminos" className="hover:text-white transition-colors">Términos de servicio</a>
          {" · "}
          <a href="/" className="hover:text-white transition-colors">Desarrollado por AE</a>
        </p>
      </footer>
    </main>
  );
}
