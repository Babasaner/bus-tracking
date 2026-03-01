"use client"

import { useEffect } from "react"
import { useTripHistory } from "@/hooks/use-trip-history"
import { MapPin, Route, Clock, CalendarDays, ExternalLink, Loader2 } from "lucide-react"

export function TripHistory() {
  const { history, loading, loadHistory } = useTripHistory()

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="mt-2 text-sm font-sans">Chargement des trajets...</span>
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
        <Route className="h-12 w-12 mb-4 opacity-20" />
        <h3 className="font-sans font-semibold text-foreground mb-1">Aucun trajet</h3>
        <p className="text-sm font-sans max-w-[250px]">
          Vos trajets apparaîtront ici lorsque vous utiliserez le mode éclaireur dans un bus.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {history.map((trip) => {
        const isDemDikk = trip.operator === "Dem Dikk"
        const operatorColor = isDemDikk ? "#1B6B3A" : "#E85D04"
        const date = new Date(trip.startTime)

        return (
          <div
            key={trip.id}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30"
          >
            {/* Header: Line + Date */}
            <div className="flex items-center justify-between border-b border-border/50 pb-2">
              <div className="flex items-center gap-2">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-md font-sans font-bold text-white"
                  style={{ backgroundColor: operatorColor }}
                >
                  {trip.lineNumber}
                </div>
                <span className="font-sans text-sm font-medium text-foreground">
                  {trip.operator}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" />
                <span className="font-sans text-xs">
                  {date.toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            {/* Route */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="font-sans text-sm text-foreground line-clamp-1">
                  <span className="text-muted-foreground mr-1">De:</span>
                  {trip.departureStop}
                </span>
              </div>
              
              <div className="ml-[6px] h-3 w-px bg-border my-0.5" />
              
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: operatorColor }} />
                <span className="font-sans text-sm text-foreground line-clamp-1">
                  <span className="text-muted-foreground mr-1">À:</span>
                  {trip.arrivalStop}
                </span>
              </div>
            </div>

            {/* Footer: Duration */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span className="font-sans text-xs">
                  {trip.durationMinutes} {trip.durationMinutes > 1 ? "minutes" : "minute"}
                </span>
              </div>
              
              {/* Future feature placeholders */}
              <button 
                className="flex items-center gap-1 text-[10px] font-sans text-muted-foreground hover:text-foreground transition-colors"
                title="Voir sur la carte (Bientôt disponible)"
              >
                <span>Carte</span>
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
