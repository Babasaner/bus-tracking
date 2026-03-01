"use client"

import { Bus, Users, Map } from "lucide-react"

interface StatsBarProps {
  totalBuses: number
  totalScouts: number
  totalLines: number
}

export function StatsBar({ totalBuses, totalScouts, totalLines }: StatsBarProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-card/80 px-4 py-2 shadow-sm backdrop-blur-sm border border-border">
      <div className="flex items-center gap-1.5">
        <Bus className="h-3.5 w-3.5 text-primary" />
        <span className="font-sans text-xs font-semibold text-foreground">{totalBuses}</span>
        <span className="font-sans text-xs text-muted-foreground hidden sm:inline">bus</span>
      </div>
      <div className="h-3 w-px bg-border" />
      <div className="flex items-center gap-1.5">
        <Users className="h-3.5 w-3.5 text-accent" />
        <span className="font-sans text-xs font-semibold text-foreground">{totalScouts}</span>
        <span className="font-sans text-xs text-muted-foreground hidden sm:inline">eclaireurs</span>
      </div>
      <div className="h-3 w-px bg-border" />
      <div className="flex items-center gap-1.5">
        <Map className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="font-sans text-xs font-semibold text-foreground">{totalLines}</span>
        <span className="font-sans text-xs text-muted-foreground hidden sm:inline">lignes</span>
      </div>
    </div>
  )
}
