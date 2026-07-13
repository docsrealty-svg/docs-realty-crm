"use client"

import { useMemo, useState } from "react"
import { BUSINESS_EXAMPLES, formatUsd, type ServiceLevel } from "../lib/cotizadorConfig"

type Variant = { title: string; description: string; price: number }
type Goal = { id: string; label: string; description: string; variants: Record<ServiceLevel, Variant> }
type Option = { id: string; label: string }

const GOALS: Goal[] = [
  {
    id: "attention", label: "Atender consultas", description: "Responder rápido y derivar cuando haga falta.",
    variants: {
      Base: { title: "Atención automática esencial", description: "Responde preguntas frecuentes, toma datos y deriva los casos que necesitan una persona.", price: 800 },
      Pro: { title: "Atención inteligente conectada", description: "Suma base de conocimiento, historial de conversaciones y registro de cada consulta.", price: 900 },
      Premium: { title: "Atención omnicanal supervisada", description: "Integra varios canales, memoria, métricas, reglas avanzadas y supervisión humana.", price: 1000 },
    },
  },
  {
    id: "bookings", label: "Agendar turnos o reservas", description: "Coordinar horarios sin mensajes de ida y vuelta.",
    variants: {
      Base: { title: "Agenda automática", description: "Consulta disponibilidad y crea, cambia o cancela turnos en una agenda.", price: 700 },
      Pro: { title: "Agenda con seguimiento", description: "Agrega confirmaciones, recordatorios, reprogramaciones y conexión con Calendar o Cal.com.", price: 1100 },
      Premium: { title: "Operación de reservas avanzada", description: "Maneja varias agendas, sedes, reglas, prioridades y coordinación por voz o WhatsApp.", price: 1500 },
    },
  },
  {
    id: "sales", label: "Vender y hacer seguimiento", description: "Ordenar oportunidades y no perder interesados.",
    variants: {
      Base: { title: "Seguimiento comercial básico", description: "Registra contactos, estados y próximos pasos para que ningún interesado quede olvidado.", price: 600 },
      Pro: { title: "Proceso comercial conectado", description: "Suma pipeline, puntuación de oportunidades, recordatorios y mensajes preparados.", price: 750 },
      Premium: { title: "Gestión comercial avanzada", description: "Distribuye consultas, coordina equipos y mide conversión, tiempos y oportunidades perdidas.", price: 900 },
    },
  },
  {
    id: "quotes", label: "Preparar presupuestos", description: "Convertir pedidos en propuestas listas para revisar.",
    variants: {
      Base: { title: "Borradores de presupuesto", description: "Recibe el pedido, detecta datos faltantes y prepara un borrador claro para revisar.", price: 450 },
      Pro: { title: "Presupuestos profesionales", description: "Aplica reglas, servicios y precios para generar una propuesta comercial completa.", price: 700 },
      Premium: { title: "Propuestas con aprobación", description: "Genera PDF, controla versiones, suma aprobaciones y conecta el proceso con ventas.", price: 1100 },
    },
  },
  {
    id: "acquisition", label: "Conseguir nuevos clientes", description: "Buscar oportunidades y activar campañas comerciales.",
    variants: {
      Base: { title: "Búsqueda de clientes potenciales", description: "Encuentra negocios por zona o rubro y arma una base priorizada.", price: 500 },
      Pro: { title: "Prospección segmentada", description: "Busca empresas y personas por perfil, cargo, ubicación y señales comerciales.", price: 750 },
      Premium: { title: "Prospección y contacto controlado", description: "Suma enriquecimiento, mensajes personalizados, seguimiento y aprobación humana.", price: 1000 },
    },
  },
  {
    id: "content", label: "Crear contenido y anuncios", description: "Mantener redes y campañas activas con menos trabajo.",
    variants: {
      Base: { title: "Contenido desde tus ideas", description: "Convierte audios o textos en publicaciones listas para revisar.", price: 500 },
      Pro: { title: "Plan de contenido conectado", description: "Suma estrategia, calendario, formatos y adaptación para diferentes redes.", price: 800 },
      Premium: { title: "Sistema de captación con contenido", description: "Integra contenido, anuncios, recursos descargables y medición de resultados.", price: 1100 },
    },
  },
  {
    id: "admin", label: "Ordenar administración", description: "Procesar facturas, documentos y aprobaciones.",
    variants: {
      Base: { title: "Recepción y orden de documentos", description: "Centraliza archivos, extrae datos y avisa cuando falta información.", price: 700 },
      Pro: { title: "Control administrativo", description: "Valida datos, detecta duplicados y aplica reglas antes de continuar.", price: 1000 },
      Premium: { title: "Circuito de aprobación completo", description: "Suma responsables, estados, auditoría, alertas e integración con otros sistemas.", price: 1300 },
    },
  },
  {
    id: "people", label: "Seleccionar y seguir candidatos", description: "Reducir trabajo manual en recursos humanos.",
    variants: {
      Base: { title: "Preselección de candidatos", description: "Lee currículums, resume perfiles y ordena la primera revisión.", price: 800 },
      Pro: { title: "Seguimiento de selección", description: "Suma mensajes, recordatorios, entrevistas y estados del proceso.", price: 1000 },
      Premium: { title: "Operación de selección avanzada", description: "Procesa lotes, compara perfiles, genera rankings y mantiene trazabilidad.", price: 1300 },
    },
  },
]

const PRIORITIES: Option[] = [
  { id: "time", label: "Ahorrar tiempo" },
  { id: "sales", label: "Vender más" },
  { id: "service", label: "Atender mejor" },
  { id: "order", label: "Ordenar el negocio" },
]

const VOLUMES: Array<Option & { score: number; help: string }> = [
  { id: "low", label: "Hasta 20 por día", score: 0, help: "Operación chica o uso puntual." },
  { id: "medium", label: "Entre 20 y 100", score: 1, help: "Flujo constante durante el día." },
  { id: "high", label: "Más de 100", score: 2, help: "Alto volumen o varios responsables." },
]

const TOOLS: Option[] = [
  { id: "whatsapp", label: "WhatsApp" },
  { id: "calendar", label: "Google Calendar" },
  { id: "email", label: "Email" },
  { id: "crm", label: "CRM o planilla" },
  { id: "store", label: "Tienda online" },
  { id: "admin", label: "Facturación o administración" },
  { id: "unknown", label: "Todavía no lo sé" },
]

const LEVEL_COPY: Record<ServiceLevel, { title: string; description: string }> = {
  Base: { title: "Base", description: "Automatiza lo esencial con una configuración simple y un circuito controlado." },
  Pro: { title: "Pro", description: "Automatiza el proceso completo, conecta herramientas y agrega seguimiento." },
  Premium: { title: "Premium", description: "Soporta más volumen, reglas, integraciones, métricas y controles avanzados." },
}

function toggle(current: string[], id: string): string[] {
  return current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
}

function getDiscountRate(count: number): number {
  return count >= 5 ? 0.3 : count === 4 ? 0.25 : count === 3 ? 0.2 : count === 2 ? 0.15 : 0
}

export default function AsesorCotizador() {
  const [step, setStep] = useState(0)
  const [name, setName] = useState("")
  const [business, setBusiness] = useState("")
  const [goalIds, setGoalIds] = useState<string[]>([])
  const [priorityIds, setPriorityIds] = useState<string[]>([])
  const [volumeId, setVolumeId] = useState("")
  const [toolIds, setToolIds] = useState<string[]>([])

  const selectedGoals = GOALS.filter((goal) => goalIds.includes(goal.id))
  const suggestedLevel = useMemo<ServiceLevel>(() => {
    const volumeScore = VOLUMES.find((item) => item.id === volumeId)?.score ?? 0
    const toolScore = toolIds.includes("unknown") ? 0 : toolIds.length >= 4 ? 2 : toolIds.length >= 2 ? 1 : 0
    const scopeScore = goalIds.length >= 4 ? 1 : 0
    const priorityScore = priorityIds.length >= 3 ? 1 : 0
    const total = volumeScore + toolScore + scopeScore + priorityScore
    return total >= 4 ? "Premium" : total >= 2 ? "Pro" : "Base"
  }, [goalIds.length, priorityIds.length, toolIds, volumeId])

  function planTotal(level: ServiceLevel): number {
    const subtotal = selectedGoals.reduce((sum, goal) => sum + goal.variants[level].price, 0)
    return Math.round(subtotal * (1 - getDiscountRate(selectedGoals.length)))
  }

  function whatsAppUrl(level: ServiceLevel): string {
    const needs = selectedGoals.map((goal) => `- ${goal.label}: ${goal.variants[level].title}`).join("\n")
    const priorities = PRIORITIES.filter((item) => priorityIds.includes(item.id)).map((item) => item.label).join(", ")
    const tools = TOOLS.filter((item) => toolIds.includes(item.id)).map((item) => item.label).join(", ")
    const message = `Hola, completé el asesor de Automatizaciones Express.\n\nNombre: ${name || "Sin indicar"}\nNegocio: ${business}\nPrioridades: ${priorities}\nVolumen: ${VOLUMES.find((item) => item.id === volumeId)?.label}\nHerramientas: ${tools}\n\nPropuesta ${level}:\n${needs}\n\nEstimado: ${formatUsd(planTotal(level))}\nQuiero revisar el alcance con un asesor.`
    return `https://wa.me/5491172373729?text=${encodeURIComponent(message)}`
  }

  const prompt = [
    "Primero, contame un poco sobre tu negocio.",
    `Bien${name ? `, ${name}` : ""}. ¿Qué te gustaría automatizar?`,
    "¿Qué resultados son importantes para vos?",
    "¿Cuántas consultas, turnos o tareas manejás por día?",
    "¿Con qué herramientas debería trabajar la automatización?",
    `Esta es la propuesta para ${business || "tu negocio"}.`,
  ][step]

  return (
    <div className="mx-auto max-w-[1280px] rounded-[32px] p-5 sm:p-8" style={{ background: "#151515", border: "1px solid rgba(255,255,255,0.1)" }}>
      <div className="mb-7 flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold" style={{ background: "#2997ff", color: "#fff" }}>AI</div>
        <div>
          <p className="text-xs font-semibold tracking-[0.15em]" style={{ color: "#2997ff" }}>ASESOR DE AUTOMATIZACIÓN</p>
          <p className="mt-2 text-lg font-semibold" style={{ color: "#f5f5f7" }}>{prompt}</p>
          <p className="mt-1 text-sm" style={{ color: "#86868b" }}>{step < 5 ? `Pregunta ${step + 1} de 5` : "Las tres opciones cubren las mismas necesidades. Cambia la profundidad de la implementación."}</p>
        </div>
      </div>

      <div className="mb-7 flex gap-2">{[0, 1, 2, 3, 4].map((item) => <span key={item} className="h-1.5 flex-1 rounded-full" style={{ background: item <= step ? "#2997ff" : "rgba(255,255,255,0.08)" }} />)}</div>

      {step === 0 && <div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label><span className="mb-2 block text-xs font-semibold" style={{ color: "#d2d2d7" }}>¿Cómo te llamás?</span><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Tu nombre" className="w-full rounded-2xl px-4 py-3 text-sm outline-none" style={{ background: "rgba(255,255,255,0.06)", color: "#f5f5f7", border: "1px solid rgba(255,255,255,0.1)" }} /></label>
          <label><span className="mb-2 block text-xs font-semibold" style={{ color: "#d2d2d7" }}>¿Qué tipo de negocio tenés?</span><input value={business} onChange={(event) => setBusiness(event.target.value)} placeholder="Ejemplo: kiosco, taller, consultorio" className="w-full rounded-2xl px-4 py-3 text-sm outline-none" style={{ background: "rgba(255,255,255,0.06)", color: "#f5f5f7", border: "1px solid rgba(255,255,255,0.1)" }} /></label>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">{BUSINESS_EXAMPLES.map((item) => <button key={item} type="button" onClick={() => setBusiness(item)} className="rounded-full px-3 py-1.5 text-xs" style={{ background: business === item ? "#f5f5f7" : "rgba(255,255,255,0.06)", color: business === item ? "#111" : "#a1a1a6" }}>{item}</button>)}</div>
        <button type="button" disabled={!business.trim()} onClick={() => setStep(1)} className="mt-7 rounded-full px-6 py-3 text-sm font-semibold disabled:opacity-35" style={{ background: "#2997ff", color: "#fff" }}>Continuar</button>
      </div>}

      {step === 1 && <ChoiceGrid options={GOALS} selected={goalIds} onToggle={(id) => setGoalIds(toggle(goalIds, id))} />}
      {step === 2 && <ChoiceGrid options={PRIORITIES} selected={priorityIds} onToggle={(id) => setPriorityIds(toggle(priorityIds, id))} />}

      {step === 3 && <div className="grid gap-3 md:grid-cols-3">{VOLUMES.map((item) => <button key={item.id} type="button" onClick={() => setVolumeId(item.id)} className="rounded-2xl p-5 text-left" style={{ background: volumeId === item.id ? "rgba(41,151,255,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${volumeId === item.id ? "rgba(41,151,255,0.55)" : "rgba(255,255,255,0.08)"}` }}><span className="block text-sm font-semibold" style={{ color: "#f5f5f7" }}>{item.label}</span><span className="mt-1 block text-xs" style={{ color: "#86868b" }}>{item.help}</span></button>)}</div>}

      {step === 4 && <ChoiceGrid options={TOOLS} selected={toolIds} onToggle={(id) => setToolIds(id === "unknown" ? [id] : toggle(toolIds.filter((item) => item !== "unknown"), id))} />}

      {step > 0 && step < 5 && <div className="mt-7 flex gap-3"><button type="button" onClick={() => setStep(step - 1)} className="rounded-full px-5 py-3 text-sm" style={{ color: "#a1a1a6", border: "1px solid rgba(255,255,255,0.1)" }}>Atrás</button><button type="button" disabled={(step === 1 && goalIds.length === 0) || (step === 2 && priorityIds.length === 0) || (step === 3 && !volumeId) || (step === 4 && toolIds.length === 0)} onClick={() => setStep(step + 1)} className="rounded-full px-6 py-3 text-sm font-semibold disabled:opacity-35" style={{ background: "#2997ff", color: "#fff" }}>{step === 4 ? "Ver mi propuesta" : "Continuar"}</button></div>}

      {step === 5 && <div>
        <div className="mb-5 rounded-2xl p-4 text-sm" style={{ background: "rgba(41,151,255,0.08)", color: "#d2d2d7", border: "1px solid rgba(41,151,255,0.25)" }}><strong style={{ color: "#f5f5f7" }}>Recomendación: {suggestedLevel}.</strong> La sugerencia considera cantidad de procesos, volumen y herramientas a conectar. Podés elegir otro nivel.</div>
        <div className="grid gap-4 lg:grid-cols-3">{(["Base", "Pro", "Premium"] as ServiceLevel[]).map((level) => {
          const recommended = level === suggestedLevel
          return <article key={level} className="flex flex-col rounded-3xl p-5" style={{ background: recommended ? "rgba(41,151,255,0.1)" : "rgba(255,255,255,0.04)", border: `1px solid ${recommended ? "rgba(41,151,255,0.6)" : "rgba(255,255,255,0.08)"}` }}>
            <div className="flex items-center justify-between gap-3"><span className="text-xs font-semibold tracking-widest" style={{ color: recommended ? "#2997ff" : "#86868b" }}>{level.toUpperCase()}</span>{recommended && <span className="rounded-full px-2.5 py-1 text-[10px] font-semibold" style={{ background: "#2997ff", color: "#fff" }}>RECOMENDADO</span>}</div>
            <h3 className="mt-3 text-lg font-semibold" style={{ color: "#f5f5f7" }}>{LEVEL_COPY[level].title}</h3>
            <p className="mt-2 text-xs leading-relaxed" style={{ color: "#86868b" }}>{LEVEL_COPY[level].description}</p>
            <div className="my-5 flex flex-1 flex-col gap-4">{selectedGoals.map((goal) => <div key={goal.id}><p className="text-sm font-semibold" style={{ color: "#f5f5f7" }}>{goal.label}</p><p className="mt-1 text-xs leading-relaxed" style={{ color: "#a1a1a6" }}>{goal.variants[level].description}</p></div>)}</div>
            <p className="text-xs" style={{ color: "#86868b" }}>Implementación estimada</p><p className="mt-1 text-2xl font-bold" style={{ color: "#f5f5f7" }}>{formatUsd(planTotal(level))}</p>
            <a href={whatsAppUrl(level)} target="_blank" rel="noopener noreferrer" className="mt-5 rounded-full py-3 text-center text-sm font-semibold" style={{ background: recommended ? "#2997ff" : "rgba(255,255,255,0.1)", color: "#fff" }}>Revisar con un asesor</a>
          </article>
        })}</div>
        <button type="button" onClick={() => setStep(0)} className="mt-6 text-sm font-semibold" style={{ color: "#86868b" }}>Empezar de nuevo</button>
      </div>}
    </div>
  )
}

function ChoiceGrid({ options, selected, onToggle }: { options: Array<Option & { description?: string }>; selected: string[]; onToggle: (id: string) => void }) {
  return <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">{options.map((option) => {
    const active = selected.includes(option.id)
    return <button key={option.id} type="button" onClick={() => onToggle(option.id)} className="rounded-2xl p-4 text-left" style={{ background: active ? "rgba(41,151,255,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${active ? "rgba(41,151,255,0.55)" : "rgba(255,255,255,0.08)"}` }}><span className="block text-sm font-semibold" style={{ color: "#f5f5f7" }}>{active ? "✓ " : ""}{option.label}</span>{option.description && <span className="mt-1 block text-xs leading-relaxed" style={{ color: "#86868b" }}>{option.description}</span>}</button>
  })}</div>
}
