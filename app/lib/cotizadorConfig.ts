export type ServiceLevel = "Base" | "Pro" | "Premium"

export type Service = {
  id: string
  category: string
  level: ServiceLevel
  name: string
  description: string
  price: number
  order: number
  critical?: boolean
}

export type SupportPlan = {
  id: string
  name: string
  price: number
  type: string
  consultations: string
  adjustments: string
  responseTime: string
}

export type Quote = {
  subtotal: number
  discountRate: number
  discountAmount: number
  implementationTotal: number
  supportMonthly: number
}

export type ServiceDetail = {
  title: string
  pitch: string
  result: string
  idealFor: string
}

export const SERVICES: Service[] = [
  { id: "inmoagent-pro", category: "Inmobiliaria", level: "Base", name: "InmoAgent PRO", description: "Atiende WhatsApp, califica consultas y deriva leads inmobiliarios.", price: 800, order: 1 },
  { id: "inmomedia-studio", category: "Inmobiliaria", level: "Pro", name: "InmoMedia Studio", description: "Genera contenido, copies y piezas para propiedades y captación.", price: 900, order: 2 },
  { id: "inmoscout-data-miner", category: "Inmobiliaria", level: "Premium", name: "InmoScout Data Miner", description: "Monitorea propiedades, precios, zonas y oportunidades de captación.", price: 1500, order: 3, critical: true },
  { id: "omnicrm-sales-agent", category: "CRM / Ventas", level: "Base", name: "OmniCRM Sales Agent", description: "CRM simple con leads, estados, historial y seguimiento.", price: 600, order: 4 },
  { id: "bookingpilot-whatsapp", category: "CRM / Ventas", level: "Pro", name: "BookingPilot WhatsApp", description: "Agenda turnos o visitas por WhatsApp con Calendar o Cal.com.", price: 700, order: 5 },
  { id: "leadrouter-crm", category: "CRM / Ventas", level: "Premium", name: "LeadRouter CRM", description: "Asigna leads al vendedor correcto según reglas y prioridad.", price: 900, order: 6 },
  { id: "humancare-whatsapp-ai", category: "WhatsApp / Atención", level: "Base", name: "HumanCare WhatsApp AI", description: "Atiende consultas generales, responde y deriva a una persona.", price: 800, order: 7 },
  { id: "catalogcloser-whatsapp", category: "WhatsApp / Atención", level: "Pro", name: "CatalogCloser WhatsApp", description: "Vende productos por catálogo: precio, stock y recomendaciones.", price: 900, order: 8 },
  { id: "quotepilot-whatsapp", category: "WhatsApp / Atención", level: "Premium", name: "QuotePilot WhatsApp", description: "Prepara presupuestos desde WhatsApp con revisión humana.", price: 1000, order: 9 },
  { id: "welcomesequence-ai", category: "Email / Propuestas", level: "Base", name: "WelcomeSequence AI", description: "Recibe leads nuevos y envía una bienvenida automatizada.", price: 450, order: 10 },
  { id: "emailguard-ai", category: "Email / Propuestas", level: "Pro", name: "EmailGuard AI", description: "Clasifica emails, resume y prepara respuestas profesionales.", price: 700, order: 11 },
  { id: "proposalpilot-pdf", category: "Email / Propuestas", level: "Premium", name: "ProposalPilot PDF", description: "Genera propuestas comerciales formales en PDF.", price: 1100, order: 12 },
  { id: "locallead-miner", category: "Prospección B2B / Leads", level: "Base", name: "LocalLead Miner", description: "Busca comercios y locales por rubro y zona.", price: 500, order: 13, critical: true },
  { id: "lead-growth-engine", category: "Prospección B2B / Leads", level: "Pro", name: "Lead Growth Engine", description: "Genera leads B2B calificados desde fuentes profesionales.", price: 750, order: 14, critical: true },
  { id: "hyperoutreach-ai", category: "Prospección B2B / Leads", level: "Premium", name: "HyperOutreach AI", description: "Prepara campañas y mensajes personalizados con aprobación.", price: 1000, order: 15, critical: true },
  { id: "whatsapp-content-intake", category: "Marketing / Contenido", level: "Base", name: "WhatsApp Content Intake", description: "Convierte ideas o audios de WhatsApp en contenido.", price: 500, order: 16 },
  { id: "social-growth-engine", category: "Marketing / Contenido", level: "Pro", name: "Social Growth Engine", description: "Arma estrategia, calendario y piezas para redes.", price: 800, order: 17 },
  { id: "leadmagnet-factory", category: "Marketing / Contenido", level: "Premium", name: "LeadMagnet Factory", description: "Crea lead magnets, PDFs, posts y secuencias de captación.", price: 1100, order: 18 },
  { id: "adsreport-commandcenter", category: "Ads / Paid Growth", level: "Base", name: "AdsReport CommandCenter", description: "Genera reportes automáticos de campañas Meta Ads.", price: 400, order: 19, critical: true },
  { id: "adcreative-launchpad", category: "Ads / Paid Growth", level: "Pro", name: "AdCreative Launchpad", description: "Genera hooks, copies y variantes creativas para anuncios.", price: 800, order: 20, critical: true },
  { id: "ads-intelligence", category: "Ads / Paid Growth", level: "Premium", name: "Ads Intelligence", description: "Analiza campañas, detecta problemas y recomienda acciones.", price: 1200, order: 21, critical: true },
  { id: "tubepilot-seo", category: "Video / Reels", level: "Base", name: "TubePilot SEO", description: "Optimiza videos para YouTube: título, descripción y etiquetas.", price: 500, order: 22 },
  { id: "quotereel-studio", category: "Video / Reels", level: "Pro", name: "QuoteReel Studio", description: "Genera videos cortos desde frases, ideas o mensajes.", price: 800, order: 23 },
  { id: "videoflow-ai", category: "Video / Reels", level: "Premium", name: "VideoFlow AI", description: "Convierte ideas y videos en guiones, escenas y piezas multicanal.", price: 1200, order: 24 },
  { id: "productstory-commerce", category: "Ecommerce", level: "Base", name: "ProductStory Commerce", description: "Mejora descripciones, SEO y copy de productos existentes.", price: 600, order: 25 },
  { id: "cartrescue-commerce", category: "Ecommerce", level: "Pro", name: "CartRescue Commerce", description: "Recupera carritos abandonados por WhatsApp o email.", price: 800, order: 26 },
  { id: "catalogpilot-commerce", category: "Ecommerce", level: "Premium", name: "CatalogPilot Commerce", description: "Crea fichas de producto desde imágenes, CSV o datos incompletos.", price: 1200, order: 27 },
  { id: "invoiceinbox-ar", category: "Finanzas / Administración", level: "Base", name: "InvoiceInbox AR", description: "Recibe y ordena facturas desde email, Drive o formularios.", price: 700, order: 28, critical: true },
  { id: "invoiceguard-ar", category: "Finanzas / Administración", level: "Pro", name: "InvoiceGuard AR", description: "Valida CUIT, CAE, duplicados y riesgo fiscal.", price: 1000, order: 29, critical: true },
  { id: "approvaldesk-ar", category: "Finanzas / Administración", level: "Premium", name: "ApprovalDesk AR", description: "Mesa de aprobación de facturas y gastos con trazabilidad.", price: 1300, order: 30, critical: true },
  { id: "knowledgeguard-whatsapp", category: "SensitiveOps / Datos sensibles", level: "Base", name: "KnowledgeGuard WhatsApp", description: "Convierte conversaciones en una base de conocimiento aprobada.", price: 700, order: 31, critical: true },
  { id: "meetingops-guard", category: "SensitiveOps / Datos sensibles", level: "Pro", name: "MeetingOps Guard", description: "Convierte reuniones en tareas y seguimiento CRM.", price: 900, order: 32, critical: true },
  { id: "creditfile-guard-ar", category: "SensitiveOps / Datos sensibles", level: "Premium", name: "CreditFile Guard AR", description: "Precalifica casos crediticios y ordena documentación sensible.", price: 1300, order: 33, critical: true },
  { id: "marketdetective-ai", category: "Detective / Inteligencia Comercial", level: "Base", name: "MarketDetective AI", description: "Analiza anuncios, competidores y ofertas activas.", price: 700, order: 34, critical: true },
  { id: "leadintel-detective", category: "Detective / Inteligencia Comercial", level: "Pro", name: "LeadIntel Detective", description: "Enriquece leads con emails, teléfonos, validación y score.", price: 900, order: 35, critical: true },
  { id: "reviewpulse-detective", category: "Detective / Inteligencia Comercial", level: "Premium", name: "ReviewPulse Detective", description: "Monitorea reseñas, reputación, quejas y oportunidades.", price: 1200, order: 36, critical: true },
  { id: "talentguard-ai", category: "TalentOps / RRHH", level: "Base", name: "TalentGuard AI", description: "Lee CVs, resume candidatos y calcula ajuste al puesto.", price: 800, order: 37, critical: true },
  { id: "talentreach-ai", category: "TalentOps / RRHH", level: "Pro", name: "TalentReach AI", description: "Prepara seguimientos, mensajes y pipeline de entrevistas.", price: 1000, order: 38 },
  { id: "talentradar-linkedin", category: "TalentOps / RRHH", level: "Premium", name: "TalentRadar LinkedIn", description: "Evalúa candidatos por lote con CSV, XLSX y LinkedIn.", price: 1300, order: 39, critical: true },
  { id: "hoteldesk-bookingops", category: "Travel / Hospitality", level: "Base", name: "HotelDesk BookingOps", description: "Ordena solicitudes de reserva y crea casos internos.", price: 800, order: 40 },
  { id: "trippilot-travelops", category: "Travel / Hospitality", level: "Pro", name: "TripPilot TravelOps", description: "Genera propuestas de viaje e itinerarios para revisar.", price: 1100, order: 41 },
  { id: "conciergedesk-voiceops", category: "Travel / Hospitality", level: "Premium", name: "ConciergeDesk VoiceOps", description: "Coordina llamadas para reservas, visitas o turnos con IA.", price: 1500, order: 42, critical: true },
]

const SERVICE_RESULTS: Record<string, string> = {
  "omnicrm-sales-agent": "Deja cada consulta calificada y registrada en un CRM.",
  "bookingpilot-whatsapp": "Agenda, reprograma y cancela turnos desde WhatsApp.",
  "leadrouter-crm": "Envía cada lead al vendedor, sucursal o equipo correcto.",
  "humancare-whatsapp-ai": "Resuelve consultas con conocimiento del negocio y deriva excepciones.",
  "catalogcloser-whatsapp": "Responde con producto, precio, stock y recomendaciones.",
  "quotepilot-whatsapp": "Deja una propuesta personalizada lista para aprobación humana.",
  "welcomesequence-ai": "Valida datos y activa una bienvenida profesional y medible.",
  "emailguard-ai": "Ordena el inbox y deja respuestas profesionales preparadas.",
  "proposalpilot-pdf": "Entrega una propuesta comercial formal lista para revisar.",
  "locallead-miner": "Entrega negocios por zona y rubro con prioridad comercial.",
  "lead-growth-engine": "Construye una base B2B segmentada por empresa, cargo y perfil.",
  "hyperoutreach-ai": "Convierte una base de leads en campañas controladas y seguimientos.",
  "whatsapp-content-intake": "Convierte audios e ideas en contenido listo para varios canales.",
  "social-growth-engine": "Define estrategia, calendario, formatos y piezas para redes.",
  "leadmagnet-factory": "Produce activos y secuencias pensados para captar contactos.",
  "adsreport-commandcenter": "Transforma datos de pauta en reportes claros y periódicos.",
  "adcreative-launchpad": "Entrega hooks, copies y variantes creativas para probar.",
  "ads-intelligence": "Detecta problemas y prioriza qué optimizar en las campañas.",
  "tubepilot-seo": "Deja cada video optimizado para búsqueda y publicación.",
  "quotereel-studio": "Genera piezas breves reutilizables a partir de una idea.",
  "videoflow-ai": "Entrega guion, escenas y adaptaciones para distintos canales.",
  "productstory-commerce": "Mejora fichas existentes para explicar, posicionar y vender.",
  "cartrescue-commerce": "Activa la recuperación y mide ventas que estaban por perderse.",
  "catalogpilot-commerce": "Genera fichas completas desde fotos, CSV o datos parciales.",
  "invoiceinbox-ar": "Centraliza comprobantes y extrae los datos principales.",
  "invoiceguard-ar": "Marca errores fiscales, inconsistencias y duplicados antes de aprobar.",
  "approvaldesk-ar": "Ordena responsables, estados y trazabilidad de cada aprobación.",
  "knowledgeguard-whatsapp": "Convierte respuestas aprobadas en conocimiento reutilizable.",
  "meetingops-guard": "Transforma acuerdos en tareas, responsables y seguimiento CRM.",
  "creditfile-guard-ar": "Ordena documentación y prepara una precalificación revisable.",
  "marketdetective-ai": "Señala movimientos del mercado y oportunidades comerciales.",
  "leadintel-detective": "Convierte prospectos incompletos en leads validados y priorizados.",
  "reviewpulse-detective": "Detecta patrones, riesgos y mejoras desde reseñas reales.",
  "talentguard-ai": "Resume candidatos y ordena la revisión por ajuste al puesto.",
  "talentreach-ai": "Prepara mensajes, recordatorios y tareas para no perder candidatos.",
  "talentradar-linkedin": "Normaliza y ordena lotes de candidatos para revisión humana.",
  "hoteldesk-bookingops": "Crea el caso de reserva y deja la respuesta lista para revisar.",
  "trippilot-travelops": "Arma itinerarios y propuestas sin confirmar compras ni reservas.",
  "conciergedesk-voiceops": "Realiza la coordinación y devuelve resumen y próximo paso.",
  "inmoagent-pro": "Califica la consulta, registra el lead y coordina el siguiente paso.",
  "inmomedia-studio": "Produce publicaciones, anuncios y piezas para cada propiedad.",
  "inmoscout-data-miner": "Ordena propiedades, precios, zonas y oportunidades de captación.",
}

const SERVICE_TITLES: Record<string, string> = {
  "omnicrm-sales-agent": "Asistente de ventas 24/7",
  "bookingpilot-whatsapp": "Agenda automática por WhatsApp",
  "leadrouter-crm": "Reparto inteligente de consultas",
  "humancare-whatsapp-ai": "Atención al cliente 24/7",
  "catalogcloser-whatsapp": "Vendedor de catálogo por WhatsApp",
  "quotepilot-whatsapp": "Presupuestos por WhatsApp",
  "welcomesequence-ai": "Bienvenida automática de clientes",
  "emailguard-ai": "Bandeja de entrada inteligente",
  "proposalpilot-pdf": "Propuestas comerciales en PDF",
  "locallead-miner": "Buscador de negocios locales",
  "lead-growth-engine": "Generador de prospectos empresariales",
  "hyperoutreach-ai": "Seguimiento comercial personalizado",
  "whatsapp-content-intake": "Contenido desde WhatsApp",
  "social-growth-engine": "Planificador de redes sociales",
  "leadmagnet-factory": "Guías para captar clientes",
  "adsreport-commandcenter": "Reportes claros de publicidad",
  "adcreative-launchpad": "Creador de anuncios",
  "ads-intelligence": "Analista de campañas",
  "tubepilot-seo": "Posicionamiento para YouTube",
  "quotereel-studio": "Creador de reels rápidos",
  "videoflow-ai": "Producción de video multicanal",
  "productstory-commerce": "Fichas de producto que venden",
  "cartrescue-commerce": "Recuperación de carritos",
  "catalogpilot-commerce": "Creador automático de catálogos",
  "invoiceinbox-ar": "Recepción automática de facturas",
  "invoiceguard-ar": "Control fiscal de facturas",
  "approvaldesk-ar": "Aprobación de gastos y facturas",
  "knowledgeguard-whatsapp": "Base de conocimiento segura",
  "meetingops-guard": "Reuniones convertidas en tareas",
  "creditfile-guard-ar": "Legajos crediticios ordenados",
  "marketdetective-ai": "Monitor de competencia",
  "leadintel-detective": "Datos completos de potenciales clientes",
  "reviewpulse-detective": "Monitor de reputación y reseñas",
  "talentguard-ai": "Preselección de candidatos",
  "talentreach-ai": "Seguimiento de candidatos",
  "talentradar-linkedin": "Ranking de candidatos",
  "hoteldesk-bookingops": "Gestión de reservas hoteleras",
  "trippilot-travelops": "Propuestas de viaje automáticas",
  "conciergedesk-voiceops": "Coordinador telefónico de reservas",
  "inmoagent-pro": "Asistente inmobiliario por WhatsApp",
  "inmomedia-studio": "Contenido para propiedades",
  "inmoscout-data-miner": "Oportunidades inmobiliarias",
}

const SERVICE_PITCHES: Record<string, string> = {
  "omnicrm-sales-agent": "Respondé más rápido, calificá cada consulta y evitá que una oportunidad de venta quede olvidada.",
  "bookingpilot-whatsapp": "Dejá que tus clientes reserven, cambien o cancelen turnos sin llamadas ni mensajes de ida y vuelta.",
  "leadrouter-crm": "Acelerá la respuesta enviando automáticamente cada consulta a la persona indicada.",
  "humancare-whatsapp-ai": "Atendé consultas frecuentes a toda hora con respuestas basadas en la información real de tu negocio.",
  "catalogcloser-whatsapp": "Convertí WhatsApp en un vendedor que muestra opciones, informa stock y acompaña la decisión de compra.",
  "quotepilot-whatsapp": "Transformá audios y mensajes de clientes en presupuestos claros, listos para revisar y enviar.",
  "welcomesequence-ai": "Dale una primera respuesta profesional a cada nuevo contacto y empezá la relación sin demoras.",
  "emailguard-ai": "Recuperá horas de trabajo clasificando correos y preparando respuestas listas para aprobar.",
  "proposalpilot-pdf": "Presentá tus servicios con propuestas profesionales que transmiten valor y ayudan a cerrar ventas.",
  "locallead-miner": "Encontrá negocios de una zona o rubro y armá una lista priorizada para empezar a vender.",
  "lead-growth-engine": "Llegá a empresas y personas con poder de decisión mediante una búsqueda comercial bien segmentada.",
  "hyperoutreach-ai": "Convertí tu lista de contactos en conversaciones con mensajes personalizados y seguimiento ordenado.",
  "whatsapp-content-intake": "Mandá una idea o audio y recibí contenido preparado para publicar en tus canales.",
  "social-growth-engine": "Dejá de improvisar: organizá temas, calendario y piezas con una estrategia coherente para tu marca.",
  "leadmagnet-factory": "Captá contactos con guías y recursos útiles que muestran tu experiencia y generan interés real.",
  "adsreport-commandcenter": "Entendé en qué se invierte, qué está funcionando y qué conviene corregir sin leer planillas complejas.",
  "adcreative-launchpad": "Probá más ideas de anuncios con textos y enfoques preparados para captar atención y vender.",
  "ads-intelligence": "Detectá rápido dónde se pierde presupuesto y recibí prioridades claras para mejorar resultados.",
  "tubepilot-seo": "Ayudá a que tus videos aparezcan en búsquedas con títulos, descripciones y etiquetas optimizadas.",
  "quotereel-studio": "Convertí ideas simples en videos cortos para mantener tus redes activas con menos producción.",
  "videoflow-ai": "Llevá una idea a guion, escenas y versiones para diferentes redes sin empezar de cero cada vez.",
  "productstory-commerce": "Hacé que cada producto se entienda mejor y resulte más atractivo para buscadores y compradores.",
  "cartrescue-commerce": "Recuperá ventas recordando a cada cliente lo que dejó pendiente, sin seguimiento manual.",
  "catalogpilot-commerce": "Publicá productos más rápido creando fichas completas desde fotos, archivos o información básica.",
  "invoiceinbox-ar": "Reuní todas tus facturas en un solo circuito y evitá búsquedas, cargas y pérdidas de documentos.",
  "invoiceguard-ar": "Reducí errores y riesgos revisando datos fiscales y comprobantes antes de que avancen.",
  "approvaldesk-ar": "Acelerá aprobaciones con responsables claros, avisos y registro de cada decisión.",
  "knowledgeguard-whatsapp": "Aprovechá las mejores respuestas de tu equipo sin exponer información sensible ni perder conocimiento.",
  "meetingops-guard": "Hacé que cada reunión termine con acuerdos, tareas y responsables concretos.",
  "creditfile-guard-ar": "Ordená documentación crediticia y detectá faltantes antes de iniciar una revisión.",
  "marketdetective-ai": "Descubrí qué ofrecen tus competidores y encontrá oportunidades para diferenciarte y vender mejor.",
  "leadintel-detective": "Completá y validá los datos de tus contactos para que ventas trabaje primero los más prometedores.",
  "reviewpulse-detective": "Convertí reseñas y comentarios en alertas tempranas y oportunidades para mejorar la experiencia.",
  "talentguard-ai": "Revisá currículums más rápido y enfocá al equipo en los candidatos con mejor encaje.",
  "talentreach-ai": "Mantené interesados a los buenos candidatos con mensajes y próximos pasos preparados a tiempo.",
  "talentradar-linkedin": "Compará muchos perfiles de forma ordenada y priorizá a quién revisar primero.",
  "hoteldesk-bookingops": "Ordená cada solicitud de reserva y respondé con rapidez sin perder datos importantes.",
  "trippilot-travelops": "Prepará itinerarios y propuestas atractivas en menos tiempo para atender más consultas.",
  "conciergedesk-voiceops": "Delegá llamadas de coordinación y recibí el resultado listo para tomar una decisión.",
  "inmoagent-pro": "Atendé consultas por propiedades, calificá interesados y coordiná el próximo paso automáticamente.",
  "inmomedia-studio": "Mostrá mejor cada propiedad con textos y piezas listos para publicar y promocionar.",
  "inmoscout-data-miner": "Detectá propiedades, zonas y precios relevantes para captar oportunidades antes.",
}

const CATEGORY_AUDIENCES: Record<string, string> = {
  "CRM / Ventas": "Pymes, servicios y equipos comerciales.",
  "WhatsApp / Atención": "Negocios con muchas consultas, tiendas y servicios.",
  "Email / Propuestas": "Ventas consultivas, soporte y administración.",
  "Prospección B2B / Leads": "Agencias, SaaS, consultoras y vendedores B2B.",
  "Marketing / Contenido": "Pymes, marcas personales y equipos de contenido.",
  "Ads / Paid Growth": "Anunciantes, agencias y marcas con pauta activa.",
  "Video / Reels": "Creadores, marcas y equipos de marketing.",
  Ecommerce: "Tiendas online, distribuidores y catálogos digitales.",
  "Finanzas / Administración": "Administración, estudios y pymes argentinas.",
  "SensitiveOps / Datos sensibles": "Equipos que manejan documentación o información sensible.",
  "Detective / Inteligencia Comercial": "Estrategia, ventas y reputación de marca.",
  "TalentOps / RRHH": "RRHH, recruiters y consultoras de selección.",
  "Travel / Hospitality": "Hoteles, agencias, turismo y servicios de concierge.",
  Inmobiliaria: "Inmobiliarias, desarrolladoras, inversores y asesores.",
}

export const CATEGORY_LABELS: Record<string, string> = {
  "CRM / Ventas": "Ventas y seguimiento",
  "WhatsApp / Atención": "Atención por WhatsApp",
  "Email / Propuestas": "Emails y presupuestos",
  "Prospección B2B / Leads": "Conseguir nuevos clientes",
  "Marketing / Contenido": "Contenido y redes",
  "Ads / Paid Growth": "Publicidad digital",
  "Video / Reels": "Videos y reels",
  Ecommerce: "Ecommerce",
  "Finanzas / Administración": "Finanzas y administración",
  "Detective / Inteligencia Comercial": "Análisis y oportunidades",
  "TalentOps / RRHH": "Selección y gestión de personal",
  "Travel / Hospitality": "Reservas y coordinación",
  Inmobiliaria: "Atención y captación",
  "SensitiveOps / Datos sensibles": "Documentos y procesos internos",
}

export const BUSINESS_EXAMPLES = [
  "Kiosco",
  "Restaurante",
  "Consultorio",
  "Tienda",
  "Taller",
  "Gimnasio",
  "Estudio profesional",
  "Inmobiliaria",
  "Hotel",
]

const BUSINESS_SEARCH_GROUPS: Array<{ terms: string; serviceIds: string[] }> = [
  {
    terms: "kiosco almacen supermercado minimercado despensa tienda comercio local ferreteria farmacia dietetica libreria jugueteria bazar mayorista distribuidor",
    serviceIds: ["omnicrm-sales-agent", "humancare-whatsapp-ai", "catalogcloser-whatsapp", "whatsapp-content-intake", "social-growth-engine", "adsreport-commandcenter", "adcreative-launchpad", "productstory-commerce", "cartrescue-commerce", "catalogpilot-commerce", "invoiceinbox-ar", "invoiceguard-ar"],
  },
  {
    terms: "restaurante bar cafeteria panaderia rotiseria pizzeria cerveceria gastronomia delivery comida",
    serviceIds: ["bookingpilot-whatsapp", "humancare-whatsapp-ai", "catalogcloser-whatsapp", "whatsapp-content-intake", "social-growth-engine", "adsreport-commandcenter", "adcreative-launchpad", "reviewpulse-detective", "invoiceinbox-ar", "conciergedesk-voiceops"],
  },
  {
    terms: "clinica consultorio dentista odontologia medico salud psicologo nutricionista kinesiologo estetica peluqueria barberia spa gimnasio entrenador yoga tattoo tatuajes",
    serviceIds: ["omnicrm-sales-agent", "bookingpilot-whatsapp", "humancare-whatsapp-ai", "welcomesequence-ai", "emailguard-ai", "whatsapp-content-intake", "social-growth-engine", "adsreport-commandcenter", "adcreative-launchpad", "reviewpulse-detective"],
  },
  {
    terms: "taller mecanico automotor repuestos servicio tecnico electricista plomero construccion reformas mantenimiento instalador",
    serviceIds: ["omnicrm-sales-agent", "bookingpilot-whatsapp", "leadrouter-crm", "humancare-whatsapp-ai", "quotepilot-whatsapp", "proposalpilot-pdf", "locallead-miner", "hyperoutreach-ai", "invoiceinbox-ar", "approvaldesk-ar"],
  },
  {
    terms: "abogado estudio juridico contador estudio contable arquitecto escribania consultor consultora agencia profesional servicios b2b pyme empresa",
    serviceIds: ["omnicrm-sales-agent", "bookingpilot-whatsapp", "leadrouter-crm", "quotepilot-whatsapp", "emailguard-ai", "proposalpilot-pdf", "locallead-miner", "lead-growth-engine", "hyperoutreach-ai", "leadmagnet-factory", "invoiceinbox-ar", "approvaldesk-ar", "meetingops-guard"],
  },
  {
    terms: "escuela academia instituto cursos capacitacion coach profesor educacion",
    serviceIds: ["omnicrm-sales-agent", "bookingpilot-whatsapp", "humancare-whatsapp-ai", "welcomesequence-ai", "hyperoutreach-ai", "whatsapp-content-intake", "social-growth-engine", "leadmagnet-factory", "quotereel-studio", "videoflow-ai"],
  },
  {
    terms: "inmobiliaria propiedades bienes raices desarrolladora constructor inversor alquileres",
    serviceIds: ["inmoagent-pro", "inmomedia-studio", "inmoscout-data-miner", "leadrouter-crm", "bookingpilot-whatsapp", "proposalpilot-pdf", "locallead-miner", "adsreport-commandcenter", "adcreative-launchpad"],
  },
  {
    terms: "hotel hosteria hospedaje alojamiento turismo agencia de viajes restaurante reservas concierge alquiler temporario",
    serviceIds: ["hoteldesk-bookingops", "trippilot-travelops", "conciergedesk-voiceops", "bookingpilot-whatsapp", "humancare-whatsapp-ai", "proposalpilot-pdf", "reviewpulse-detective"],
  },
  {
    terms: "fabrica industria deposito logistica importador exportador produccion proveedor",
    serviceIds: ["omnicrm-sales-agent", "leadrouter-crm", "lead-growth-engine", "hyperoutreach-ai", "catalogpilot-commerce", "invoiceinbox-ar", "invoiceguard-ar", "approvaldesk-ar", "meetingops-guard", "talentguard-ai", "talentreach-ai"],
  },
  {
    terms: "recursos humanos rrhh seleccion personal empleados recruiting candidatos consultora laboral",
    serviceIds: ["talentguard-ai", "talentreach-ai", "talentradar-linkedin", "meetingops-guard", "knowledgeguard-whatsapp"],
  },
]

export function getServiceSearchTerms(serviceId: string): string {
  return BUSINESS_SEARCH_GROUPS.filter((group) => group.serviceIds.includes(serviceId)).map((group) => group.terms).join(" ")
}

export function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category
}

export function getServiceDetail(service: Service): ServiceDetail {
  return {
    title: SERVICE_TITLES[service.id],
    pitch: SERVICE_PITCHES[service.id],
    result: SERVICE_RESULTS[service.id],
    idealFor: CATEGORY_AUDIENCES[service.category],
  }
}

export const SUPPORT_PLANS: SupportPlan[] = [
  { id: "support-base", name: "Soporte Base", price: 150, type: "Monitoreo automático 24/7 y soporte humano", consultations: "1 consulta mensual", adjustments: "1 ajuste menor mensual", responseTime: "48 a 72 hs hábiles" },
  { id: "support-pro", name: "Soporte Pro", price: 300, type: "Monitoreo 24/7 y soporte humano prioritario", consultations: "2 consultas mensuales", adjustments: "Hasta 3 ajustes menores", responseTime: "24 a 48 hs hábiles" },
  { id: "support-premium", name: "Soporte Premium", price: 500, type: "Monitoreo 24/7 y prioridad alta", consultations: "4 consultas mensuales", adjustments: "Hasta 6 ajustes menores", responseTime: "8 a 24 hs hábiles" },
]

export const CATEGORIES = [
  "CRM / Ventas",
  "WhatsApp / Atención",
  "Email / Propuestas",
  "Prospección B2B / Leads",
  "Marketing / Contenido",
  "Ads / Paid Growth",
  "Video / Reels",
  "Ecommerce",
  "Finanzas / Administración",
  "Detective / Inteligencia Comercial",
  "TalentOps / RRHH",
  "Travel / Hospitality",
  "Inmobiliaria",
  "SensitiveOps / Datos sensibles",
]
export const LEVELS: ServiceLevel[] = ["Base", "Pro", "Premium"]

export function formatUsd(value: number): string {
  return `USD ${new Intl.NumberFormat("es-AR").format(value)}`
}

export function getService(id: string): Service | undefined {
  return SERVICES.find((service) => service.id === id)
}

export function getDiscountRate(services: Service[]): number {
  const count = services.length
  const standardRate = count >= 5 ? 0.3 : count === 4 ? 0.25 : count === 3 ? 0.2 : count === 2 ? 0.15 : 0
  return services.some((service) => service.critical) ? Math.min(standardRate, 0.15) : standardRate
}

export function calculateQuote(services: Service[], support?: SupportPlan): Quote {
  const subtotal = services.reduce((sum, service) => sum + service.price, 0)
  const discountRate = getDiscountRate(services)
  const discountAmount = Math.round(subtotal * discountRate)
  return {
    subtotal,
    discountRate,
    discountAmount,
    implementationTotal: subtotal - discountAmount,
    supportMonthly: support?.price ?? 0,
  }
}

export function buildWhatsAppMessage(services: Service[], support: SupportPlan | undefined, quote: Quote): string {
  const lines = services.map((service) => `- ${getServiceDetail(service).title} (${service.level}): ${formatUsd(service.price)}`)
  return encodeURIComponent([
    "Hola, armé una cotización en Automatizaciones Express:",
    "",
    ...lines,
    "",
    `Subtotal: ${formatUsd(quote.subtotal)}`,
    quote.discountRate > 0 ? `Descuento por integración: ${Math.round(quote.discountRate * 100)}%` : "Descuento por integración: 0%",
    `Total implementación: ${formatUsd(quote.implementationTotal)}`,
    support ? `${support.name}: ${formatUsd(support.price)}/mes` : "Soporte mensual: sin seleccionar",
    "",
    "Quiero revisar el alcance y confirmar este presupuesto.",
  ].join("\n"))
}
