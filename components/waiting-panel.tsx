"use client"

import { Badge } from "@/components/ui/badge"
import { BUS_LINES } from "@/lib/dakar-bus-data"
import type { ActiveBus } from "@/lib/dakar-bus-data"
import { Clock, Bus, Users, MapPin, Signal } from "lucide-react"

interface WaitingPanelProps {
  buses: ActiveBus[]
  onSelectLine: (lineId: string) => void
}

export function WaitingPanel({ buses, onSelectLine }: WaitingPanelProps) {
  // Group buses by line and find closest one per line
  const lineData = BUS_LINES.map((line) => {
    const lineBuses = buses
      .filter((b) => b.lineId === line.id)
      .sort((a, b) => a.eta - b.eta)
    const closestBus = lineBuses[0] || null

    return {
      line,
      activeBuses: lineBuses.length,
      closestBus,
      totalScouts: lineBuses.reduce((sum, b) => sum + b.scoutCount, 0),
    }
  })

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="rounded-xl bg-primary/5 p-4 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Clock className="h-7 w-7 text-primary" />
        </div>
        <h3 className="mb-1 font-sans text-base font-bold text-foreground">
          Bus en approche
        </h3>
        <p className="font-sans text-xs text-muted-foreground leading-relaxed">
          Consultez en temps reel les bus qui arrivent sur chaque ligne, avec
          le temps d&apos;attente estime.
        </p>
      </div>

      {/* Live stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-border bg-card p-3 text-center">
          <Bus className="mx-auto mb-1 h-5 w-5 text-primary" />
          <p className="font-sans text-xl font-bold text-foreground">
            {buses.length}
          </p>
          <p className="font-sans text-[10px] text-muted-foreground">
            Bus en circulation
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3 text-center">
          <Users className="mx-auto mb-1 h-5 w-5 text-accent" />
          <p className="font-sans text-xl font-bold text-foreground">
            {buses.reduce((sum, b) => sum + b.scoutCount, 0)}
          </p>
          <p className="font-sans text-[10px] text-muted-foreground">
            Eclaireurs actifs
          </p>
        </div>
      </div>

      {/* Lines with ETAs */}
      <div>
        <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Temps d&apos;attente estimes
        </p>
        <div className="flex flex-col gap-2">
          {lineData.map(({ line, activeBuses, closestBus, totalScouts }) => (
            <button
              key={line.id}
              onClick={() => onSelectLine(line.id)}
              className="rounded-xl border border-border bg-card p-3 text-left transition-all hover:border-primary/30 hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg font-sans text-sm font-bold text-card"
                    style={{ backgroundColor: line.color }}
                  >
                    {line.number}
                  </div>
                  <div>
                    <p className="font-sans text-sm font-medium text-foreground">
                      {line.name}
                    </p>
                    <div className="mt-0.5 flex items-center gap-2 font-sans text-xs text-muted-foreground">
                      <span className="flex items-center gap-0.5">
                        <Bus className="h-3 w-3" /> {activeBuses}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Users className="h-3 w-3" /> {totalScouts}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Signal className="h-3 w-3" /> {line.fare} CFA
                      </span>
                    </div>
                  </div>
                </div>

                {closestBus ? (
                  <div className="text-right">
                    <p className="font-sans text-lg font-bold text-primary">
                      {closestBus.eta} <span className="text-xs font-normal">min</span>
                    </p>
                    <p className="font-sans text-[10px] text-muted-foreground">
                      {closestBus.nextStop}
                    </p>
                  </div>
                ) : (
                  <Badge variant="outline" className="font-sans text-xs text-muted-foreground">
                    Aucun signal
                  </Badge>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="rounded-lg bg-secondary/50 p-3">
        <p className="font-sans text-[11px] text-muted-foreground text-center leading-relaxed">
          Les temps d&apos;attente sont bases sur les donnees GPS partagees par
          les eclaireurs (passagers). Plus il y a d&apos;eclaireurs, plus les
          estimations sont precises.
        </p>
      </div>
    </div>
  )
}
