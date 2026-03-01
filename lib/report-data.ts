// Community report types and data for the Waze-like alert system

export type ReportCategory =
  | "traffic"
  | "control"
  | "bus_status"
  | "danger"
  | "new_stop"

export type TrafficSeverity = "light" | "blocked" | "accident"
export type ControlType = "police" | "gendarmerie"
export type BusStatusType = "full" | "breakdown" | "seats_available"
export type DangerType = "protest" | "road_blocked"

export interface Report {
  id: string
  category: ReportCategory
  subType: string
  lat: number
  lng: number
  locationName: string
  lineId?: string
  lineNumber?: string
  userName: string
  userId: string
  timestamp: number
  expiresAt: number // Timestamp when this report should auto-expire
  upvotes: number
  active: boolean
  message?: string
  photoUrl?: string
}

export interface ReportType {
  category: ReportCategory
  label: string
  icon: string
  color: string
  subTypes: { value: string; label: string }[]
}

export const REPORT_TYPES: ReportType[] = [
  {
    category: "traffic",
    label: "Trafic & Autre",
    icon: "traffic",
    color: "#DC2626",
    subTypes: [
      { value: "light", label: "Léger" },
      { value: "blocked", label: "Bloqué" },
      { value: "accident", label: "Accident" },
      { value: "delay", label: "Retard" },
    ],
  },
  {
    category: "control",
    label: "Controle",
    icon: "shield",
    color: "#2563EB",
    subTypes: [
      { value: "police", label: "Police" },
      { value: "gendarmerie", label: "Gendarmerie" },
    ],
  },
  {
    category: "bus_status",
    label: "Etat du Bus",
    icon: "bus",
    color: "#D97706",
    subTypes: [
      { value: "full", label: "Plein (ne s'arrete plus)" },
      { value: "breakdown", label: "En panne" },
      { value: "seats_available", label: "Places dispo" },
    ],
  },
  {
    category: "danger",
    label: "Danger & Situation",
    icon: "danger",
    color: "#DC2626",
    subTypes: [
      { value: "protest", label: "Manifestation" },
      { value: "road_blocked", label: "Route barrée" },
      { value: "road_closure", label: "Fermeture de route" },
    ],
  },
  {
    category: "new_stop",
    label: "Nouvel Arret",
    icon: "pin",
    color: "#059669",
    subTypes: [
      { value: "new_stop", label: "Arret non repertorie" },
    ],
  },
]

// Known Dakar hotspots for simulated reports
export const DAKAR_HOTSPOTS = [
  { name: "Rond-point Poste Thiaroye", lat: 14.7442, lng: -17.3753 },
  { name: "Bountou Pikine", lat: 14.7575, lng: -17.3936 },
  { name: "Patte d'Oie", lat: 14.7350, lng: -17.4400 },
  { name: "Rond-point Liberte 6", lat: 14.7231, lng: -17.4586 },
  { name: "Colobane", lat: 14.6889, lng: -17.4500 },
  { name: "Grand Yoff", lat: 14.7414, lng: -17.4489 },
  { name: "Sandaga", lat: 14.6717, lng: -17.4383 },
  { name: "Parcelles Assainies", lat: 14.7667, lng: -17.4417 },
  { name: "Mermoz", lat: 14.7183, lng: -17.4736 },
  { name: "Ouakam", lat: 14.7253, lng: -17.4878 },
  { name: "Pikine centre", lat: 14.7550, lng: -17.3900 },
  { name: "Point E", lat: 14.6933, lng: -17.4642 },
]

// Removed simulated SENEGALESE_NAMES

// Format relative time in French
export function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return "a l'instant"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `il y a ${minutes} min`
  const hours = Math.floor(minutes / 60)
  return `il y a ${hours}h`
}

// Generate a notification message based on report
export function generateNotificationMessage(report: Report): string {
  const lineInfo = report.lineNumber ? `Bus ${report.lineNumber}` : ""

  switch (report.category) {
    case "traffic":
      if (report.subType === "light")
        return `Ralentissement signalé au niveau de ${report.locationName}. Retard possible pour les lignes passant par là.`
      if (report.subType === "blocked")
        return `Gros bouchon signalé au niveau de ${report.locationName}. Retard estimé : +25 min pour toutes les lignes passant par là.`
      if (report.subType === "accident")
        return `Accident signalé à ${report.locationName}. Circulation fortement perturbée.`
      if (report.subType === "delay")
        return `Retard de bus signalé à ${report.locationName}.`
      return ""

    case "control":
      return `Controle de ${report.subType === "police" ? "police" : "gendarmerie"} signale a ${report.locationName}. Circulation ralentie.`

    case "bus_status":
      if (report.subType === "full")
        return `${lineInfo ? `L'eclaireur ${report.userName} signale que le ${lineInfo}` : "Un bus"} qui arrive a ${report.locationName} est archi-plein. Prevoyez de prendre le suivant ou un Tata.`
      if (report.subType === "breakdown")
        return `${lineInfo || "Un bus"} en panne signale a ${report.locationName}. Perturbations possibles sur cette ligne.`
      if (report.subType === "seats_available")
        return `${lineInfo || "Un bus"} avec des places disponibles signale a ${report.locationName}.`
      return ""

    case "danger":
      if (report.subType === "protest")
        return `Manifestation signalée à ${report.locationName}. Déviations possibles pour les bus.`
      if (report.subType === "road_blocked" || report.subType === "road_closure")
        return `Route barrée signalée à ${report.locationName}. Les bus sont déviés.`
      return ""

    case "new_stop":
      return `${report.userName} signale un arret de bus non repertorie a ${report.locationName}.`

    default:
      return ""
  }
}

// Get category header for notifications
export function getCategoryHeader(report: Report): string {
  switch (report.category) {
    case "traffic":
      return "Info Trafic"
    case "control":
      return "Vigilance"
    case "bus_status":
      return report.lineNumber ? `Alerte Bus ${report.lineNumber}` : "Alerte Bus"
    case "danger":
      return "Danger"
    case "new_stop":
      return "Nouvel Arret"
    default:
      return "Signalement"
  }
}
