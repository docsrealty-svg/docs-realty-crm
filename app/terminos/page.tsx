export default function Terminos() {
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
          <h1 className="text-3xl font-bold mb-12" style={{ color: "#f5f5f7" }}>Términos de servicio</h1>

          <div className="flex flex-col gap-10">
            <div>
              <h2 className="text-base font-semibold mb-3" style={{ color: "#f5f5f7" }}>1. Descripción del servicio</h2>
              <p className="text-sm leading-relaxed" style={{ color: "#86868b" }}>
                Automatizaciones Express ofrece servicios de implementación de sistemas de automatización e inteligencia artificial para negocios. Esto incluye el diseño, configuración, implementación y soporte de flujos automatizados que operan sobre plataformas de terceros (WhatsApp, email, CRM, entre otras).
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold mb-3" style={{ color: "#f5f5f7" }}>2. Proceso de contratación</h2>
              <p className="text-sm leading-relaxed" style={{ color: "#86868b" }}>
                El servicio comienza con una consulta por WhatsApp o email en la que el cliente describe su negocio y sus necesidades. A partir de esa información presentamos una propuesta con alcance, precio y plazo de entrega. El servicio se considera contratado una vez confirmada la aceptación de la propuesta y realizado el pago acordado.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold mb-3" style={{ color: "#f5f5f7" }}>3. Plazos de entrega</h2>
              <p className="text-sm leading-relaxed" style={{ color: "#86868b" }}>
                Los plazos indicados en la propuesta son estimativos y se calculan desde la confirmación del pago y la entrega de la información necesaria por parte del cliente. Automatizaciones Express no se responsabiliza por demoras ocasionadas por falta de información, accesos o respuestas del cliente.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold mb-3" style={{ color: "#f5f5f7" }}>4. Costos adicionales de APIs y plataformas</h2>
              <p className="text-sm leading-relaxed" style={{ color: "#86868b" }}>
                Los sistemas implementados pueden requerir el uso de servicios externos (procesamiento de mensajes con IA, APIs de mensajería, plataformas de email, etc.). Estos costos son independientes del servicio de implementación y corren por cuenta del cliente. Informamos los costos estimados antes de iniciar cualquier proyecto.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold mb-3" style={{ color: "#f5f5f7" }}>5. Soporte y mantenimiento</h2>
              <p className="text-sm leading-relaxed" style={{ color: "#86868b" }}>
                El soporte correctivo está incluido durante el período de implementación. Una vez entregado el sistema, el mantenimiento continuo (actualizaciones, mejoras, monitoreo) está disponible como un abono mensual separado, cuyo valor se acuerda al momento de la contratación. El soporte no incluye modificaciones de alcance o nuevos flujos no contemplados en la propuesta original.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold mb-3" style={{ color: "#f5f5f7" }}>6. Propiedad del sistema</h2>
              <p className="text-sm leading-relaxed" style={{ color: "#86868b" }}>
                Una vez abonado el servicio y entregado el sistema, el cliente es propietario de su implementación. Automatizaciones Express no retiene acceso a los sistemas entregados salvo acuerdo explícito de mantenimiento vigente.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold mb-3" style={{ color: "#f5f5f7" }}>7. Limitación de responsabilidad</h2>
              <p className="text-sm leading-relaxed" style={{ color: "#86868b" }}>
                Automatizaciones Express no se responsabiliza por interrupciones o cambios en plataformas de terceros (WhatsApp, Meta, Google, etc.) que afecten el funcionamiento de los sistemas implementados. Tampoco nos responsabilizamos por el uso que el cliente haga de los sistemas entregados ni por resultados comerciales derivados de su uso.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold mb-3" style={{ color: "#f5f5f7" }}>8. Cancelaciones y reembolsos</h2>
              <p className="text-sm leading-relaxed" style={{ color: "#86868b" }}>
                Si el cliente cancela el servicio antes de iniciada la implementación, se reembolsa el 60% del monto abonado. Una vez iniciado el trabajo no hay reembolso por los servicios ya prestados. Los casos excepcionales se evalúan individualmente.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold mb-3" style={{ color: "#f5f5f7" }}>9. Modificaciones</h2>
              <p className="text-sm leading-relaxed" style={{ color: "#86868b" }}>
                Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios se publicarán en esta página. El uso continuado del servicio implica la aceptación de los términos vigentes.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold mb-3" style={{ color: "#f5f5f7" }}>10. Contacto</h2>
              <p className="text-sm leading-relaxed" style={{ color: "#86868b" }}>
                Para consultas sobre estos términos escribinos a{" "}
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
          <a href="/privacidad" className="hover:text-white transition-colors">Política de privacidad</a>
          {" · "}
          <a href="/" className="hover:text-white transition-colors">Desarrollado por AE</a>
        </p>
      </footer>
    </main>
  );
}
