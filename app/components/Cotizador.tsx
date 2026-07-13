"use client"

import { useMemo, useState } from "react"
import AsesorCotizador from "./AsesorCotizador"
import {
  BUSINESS_EXAMPLES,
  CATEGORIES,
  LEVELS,
  SERVICES,
  SUPPORT_PLANS,
  buildWhatsAppMessage,
  calculateQuote,
  formatUsd,
  getCategoryLabel,
  getServiceDetail,
  getServiceSearchTerms,
  type Service,
  type ServiceLevel,
} from "../lib/cotizadorConfig"

type LevelFilter = "Todos" | ServiceLevel
type CategoryFilter = "Todos" | string

const LEVEL_STYLES: Record<ServiceLevel, { color: string; background: string }> = {
  Base: { color: "#34c759", background: "rgba(52,199,89,0.12)" },
  Pro: { color: "#2997ff", background: "rgba(41,151,255,0.12)" },
  Premium: { color: "#bf5af2", background: "rgba(191,90,242,0.13)" },
}

function normalizeSearch(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es")
}

export default function Cotizador() {
  const [experience, setExperience] = useState<"advisor" | "manual">("advisor")
  const [category, setCategory] = useState<CategoryFilter>("Todos")
  const [level, setLevel] = useState<LevelFilter>("Base")
  const [search, setSearch] = useState("")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [supportId, setSupportId] = useState("")

  const visibleServices = useMemo(() => {
    const term = normalizeSearch(search.trim())
    return SERVICES.filter((service) => {
      const detail = getServiceDetail(service)
      const matchesCategory = search || category === "Todos" ? true : service.category === category
      const matchesLevel = level === "Todos" || service.level === level
      const searchIndex = normalizeSearch(`${service.name} ${detail.title} ${detail.pitch} ${service.description} ${service.category} ${getCategoryLabel(service.category)} ${detail.result} ${detail.idealFor} ${getServiceSearchTerms(service.id)}`)
      const matchesSearch = !term || searchIndex.includes(term)
      return matchesCategory && matchesLevel && matchesSearch
    }).sort((a, b) => CATEGORIES.indexOf(a.category) - CATEGORIES.indexOf(b.category) || a.order - b.order)
  }, [category, level, search])

  const selectedServices = SERVICES.filter((service) => selectedIds.includes(service.id))
  const support = SUPPORT_PLANS.find((plan) => plan.id === supportId)
  const quote = calculateQuote(selectedServices, support)
  const waMessage = buildWhatsAppMessage(selectedServices, support, quote)
  const hasCriticalService = selectedServices.some((service) => service.critical)

  function toggleService(service: Service) {
    setSelectedIds((current) =>
      current.includes(service.id)
        ? current.filter((id) => id !== service.id)
        : [...current, service.id]
    )
  }

  return (
    <section id="cotizador" className="px-5 py-20" style={{ background: "#080808", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="mx-auto max-w-[1480px]">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-semibold tracking-[0.2em]" style={{ color: "#2997ff" }}>COTIZADOR DE SERVICIOS</p>
          <h2 className="headline-lg mb-3">Armá tu automatización.</h2>
          <p className="mx-auto max-w-2xl text-base sm:text-lg" style={{ color: "#86868b" }}>
            Contanos cómo funciona tu negocio y te guiamos hasta una propuesta. También podés elegir los servicios por tu cuenta.
          </p>
        </div>

        <div className="mb-8 flex justify-center gap-2">
          <button type="button" onClick={() => setExperience("advisor")} className="rounded-full px-5 py-2.5 text-sm font-semibold" style={{ background: experience === "advisor" ? "#f5f5f7" : "rgba(255,255,255,0.06)", color: experience === "advisor" ? "#111" : "#a1a1a6" }}>Guiame paso a paso</button>
          <button type="button" onClick={() => setExperience("manual")} className="rounded-full px-5 py-2.5 text-sm font-semibold" style={{ background: experience === "manual" ? "#f5f5f7" : "rgba(255,255,255,0.06)", color: experience === "manual" ? "#111" : "#a1a1a6" }}>Elegir por mi cuenta</button>
        </div>

        {experience === "advisor" ? (
          <AsesorCotizador />
        ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
          <div className="min-w-0">
            <div className="mb-5 rounded-3xl p-4 sm:p-5" style={{ background: "#151515", border: "1px solid rgba(255,255,255,0.08)" }}>
              <label className="relative block">
                <span className="sr-only">Buscar servicios</span>
                <input
                  value={search}
                  onChange={(event) => { const value = event.target.value; setSearch(value); if (value.trim()) setLevel("Todos") }}
                  placeholder="Buscar por servicio, rubro o función..."
                  className="w-full rounded-2xl px-4 py-3 text-sm outline-none"
                  style={{ background: "rgba(255,255,255,0.06)", color: "#f5f5f7", border: "1px solid rgba(255,255,255,0.1)" }}
                />
              </label>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="mr-1 text-xs" style={{ color: "#86868b" }}>Probá por negocio:</span>
                {BUSINESS_EXAMPLES.map((business) => (
                  <button
                    key={business}
                    type="button"
                    onClick={() => { setSearch(business); setCategory("Todos"); setLevel("Todos") }}
                    className="rounded-full px-2.5 py-1 text-[11px] font-medium"
                    style={{ background: "rgba(255,255,255,0.05)", color: "#a1a1a6", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    {business}
                  </button>
                ))}
              </div>

              <div className="mt-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: "#86868b" }}>Elegí el rubro o área</p>
                <div className="flex flex-wrap gap-2">
                {(["Todos", ...CATEGORIES] as CategoryFilter[]).map((item) => {
                  const active = !search && category === item
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => { setCategory(item); setLevel(item === "Todos" ? "Base" : "Todos"); setSearch("") }}
                      className="rounded-full px-3.5 py-2 text-xs font-semibold transition-colors"
                      style={{ background: active ? "#f5f5f7" : "rgba(255,255,255,0.06)", color: active ? "#111" : "#a1a1a6" }}
                    >
                      {item === "Todos" ? item : getCategoryLabel(item)}
                    </button>
                  )
                })}
                </div>
              </div>

              <div className="mt-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: "#86868b" }}>Nivel de implementación</p>
                <div className="flex flex-wrap gap-2">
                {(["Todos", ...LEVELS] as LevelFilter[]).map((item) => {
                  const active = level === item
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setLevel(item)}
                      className="rounded-full px-3 py-1.5 text-xs font-medium"
                      style={{ background: active ? "rgba(41,151,255,0.15)" : "transparent", color: active ? "#2997ff" : "#6e6e73", border: `1px solid ${active ? "rgba(41,151,255,0.35)" : "rgba(255,255,255,0.08)"}` }}
                    >
                      {item}
                    </button>
                  )
                })}
                </div>
              </div>
            </div>

            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold" style={{ color: "#f5f5f7" }}>
                {search ? `${visibleServices.length} resultados` : category === "Todos" ? "Todos los rubros" : getCategoryLabel(category)}
              </p>
              <p className="text-xs" style={{ color: "#6e6e73" }}>Precios de implementación</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {visibleServices.map((service) => {
                const selected = selectedIds.includes(service.id)
                const levelStyle = LEVEL_STYLES[service.level]
                const detail = getServiceDetail(service)
                return (
                  <article
                    key={service.id}
                    className="flex min-h-[370px] flex-col rounded-3xl p-5 transition-transform hover:-translate-y-0.5"
                    style={{ background: selected ? "rgba(41,151,255,0.08)" : "#151515", border: `1px solid ${selected ? "rgba(41,151,255,0.55)" : "rgba(255,255,255,0.08)"}` }}
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{ color: levelStyle.color, background: levelStyle.background }}>
                        {service.level}
                      </span>
                      <span className="text-sm font-bold" style={{ color: "#f5f5f7" }}>{formatUsd(service.price)}</span>
                    </div>
                    <h3 className="mb-2 text-base font-semibold" style={{ color: "#f5f5f7" }}>{detail.title}</h3>
                    <p className="mb-3 text-xs font-medium" style={{ color: "#2997ff" }}>{getCategoryLabel(service.category)}</p>
                    <dl className="mb-5 flex-1 space-y-3 text-xs leading-relaxed">
                      <div>
                        <dt className="font-semibold" style={{ color: "#f5f5f7" }}>Cómo ayuda a tu negocio</dt>
                        <dd className="mt-1" style={{ color: "#a1a1a6" }}>{detail.pitch}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold" style={{ color: "#f5f5f7" }}>Qué recibís</dt>
                        <dd className="mt-1" style={{ color: "#a1a1a6" }}>{detail.result}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold" style={{ color: "#f5f5f7" }}>Ideal para</dt>
                        <dd className="mt-1" style={{ color: "#a1a1a6" }}>{detail.idealFor}</dd>
                      </div>
                    </dl>
                    <button
                      type="button"
                      onClick={() => toggleService(service)}
                      className="w-full rounded-full py-2.5 text-sm font-semibold transition-colors"
                      style={{ background: selected ? "rgba(255,255,255,0.08)" : "#2997ff", color: "#fff" }}
                    >
                      {selected ? "Quitar del presupuesto" : "Agregar al presupuesto"}
                    </button>
                  </article>
                )
              })}
            </div>
            {visibleServices.length === 0 && (
              <div className="rounded-3xl p-8 text-center" style={{ background: "#151515", border: "1px solid rgba(255,255,255,0.08)" }}>
                <p className="font-semibold" style={{ color: "#f5f5f7" }}>No encontramos una coincidencia directa.</p>
                <p className="mt-2 text-sm" style={{ color: "#86868b" }}>Probá con el tipo de negocio o con una tarea: turnos, ventas, facturas, contenido o atención.</p>
              </div>
            )}
          </div>

          <aside className="rounded-3xl p-5 sm:p-6 lg:sticky lg:top-16" style={{ background: "#f5f5f7", color: "#1d1d1f" }}>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold tracking-[0.16em]" style={{ color: "#6e6e73" }}>TU PRESUPUESTO</p>
                <p className="mt-1 text-sm font-medium">{selectedServices.length} módulo{selectedServices.length === 1 ? "" : "s"}</p>
              </div>
              {selectedServices.length > 0 && (
                <button type="button" onClick={() => { setSelectedIds([]); setSupportId("") }} className="text-xs font-semibold" style={{ color: "#0071e3" }}>
                  Limpiar
                </button>
              )}
            </div>

            {selectedServices.length === 0 ? (
              <div className="rounded-2xl p-5 text-center" style={{ background: "#fff", border: "1px dashed #d2d2d7" }}>
                <p className="text-sm font-semibold">Todavía no agregaste servicios.</p>
                <p className="mt-1 text-xs leading-relaxed" style={{ color: "#6e6e73" }}>Elegí uno o varios módulos para calcular la implementación.</p>
              </div>
            ) : (
              <div className="mb-5 flex max-h-56 flex-col gap-2 overflow-y-auto pr-1">
                {selectedServices.map((service) => (
                  <div key={service.id} className="flex items-start justify-between gap-3 rounded-2xl bg-white p-3">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold">{getServiceDetail(service).title}</p>
                      <p className="mt-0.5 text-[11px]" style={{ color: "#6e6e73" }}>{getCategoryLabel(service.category)} · {service.level}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs font-semibold">{formatUsd(service.price)}</p>
                      <button type="button" onClick={() => toggleService(service)} className="mt-1 text-[11px]" style={{ color: "#ff3b30" }}>Quitar</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="my-5" style={{ height: 1, background: "#d2d2d7" }} />

            <div>
              <p className="mb-2 text-xs font-semibold">Soporte mensual opcional</p>
              <select
                value={supportId}
                onChange={(event) => setSupportId(event.target.value)}
                className="w-full rounded-xl bg-white px-3 py-2.5 text-sm outline-none"
                style={{ border: "1px solid #d2d2d7" }}
              >
                <option value="">Sin soporte mensual</option>
                {SUPPORT_PLANS.map((plan) => (
                  <option key={plan.id} value={plan.id}>{plan.name} · {formatUsd(plan.price)}/mes</option>
                ))}
              </select>
              {support && (
                <div className="mt-2 rounded-xl bg-white p-3 text-[11px] leading-relaxed" style={{ color: "#6e6e73" }}>
                  {support.type}. {support.consultations}, {support.adjustments}. Respuesta: {support.responseTime}.
                </div>
              )}
            </div>

            <div className="my-5 flex flex-col gap-2 text-sm">
              <div className="flex justify-between"><span style={{ color: "#6e6e73" }}>Subtotal</span><strong>{formatUsd(quote.subtotal)}</strong></div>
              <div className="flex justify-between"><span style={{ color: "#6e6e73" }}>Descuento integración</span><strong style={{ color: quote.discountAmount > 0 ? "#248a3d" : "inherit" }}>-{formatUsd(quote.discountAmount)}</strong></div>
              {quote.supportMonthly > 0 && <div className="flex justify-between"><span style={{ color: "#6e6e73" }}>Soporte mensual</span><strong>{formatUsd(quote.supportMonthly)}/mes</strong></div>}
            </div>

            {hasCriticalService && selectedServices.length > 1 && (
              <p className="mb-4 rounded-xl px-3 py-2 text-[11px] leading-relaxed" style={{ background: "#fff4ce", color: "#6b5600" }}>
                El descuento máximo es 15% porque la selección incluye integraciones críticas o datos sensibles.
              </p>
            )}

            <div className="rounded-2xl p-4" style={{ background: "#1d1d1f", color: "#f5f5f7" }}>
              <p className="text-xs" style={{ color: "#86868b" }}>Total implementación</p>
              <p className="mt-1 text-3xl font-bold tracking-tight">{formatUsd(quote.implementationTotal)}</p>
              <p className="mt-2 text-[11px]" style={{ color: "#86868b" }}>Estimado según el alcance publicado. La propuesta final confirma integraciones y plazos.</p>
            </div>

            <a
              href={selectedServices.length > 0 ? `https://wa.me/5491172373729?text=${waMessage}` : undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={selectedServices.length === 0}
              className="mt-4 block w-full rounded-full py-3.5 text-center text-sm font-semibold"
              style={{ background: selectedServices.length > 0 ? "#25d366" : "#d2d2d7", color: selectedServices.length > 0 ? "#fff" : "#86868b", pointerEvents: selectedServices.length > 0 ? "auto" : "none" }}
            >
              Enviar presupuesto por WhatsApp
            </a>
          </aside>
        </div>
        )}
      </div>
    </section>
  )
}
