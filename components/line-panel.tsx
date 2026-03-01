"use client"

import { BUS_LINES } from "@/lib/dakar-bus-data"
import { Button } from "@/components/ui/button"
import { Bus, Users, ChevronRight, X } from "lucide-react"
import type { ActiveBus } from "@/lib/dakar-bus-data"

interface LinePanelProps {
  selectedLine: string | null
  onSelectLine: (lineId: string | null) => void
  buses: ActiveBus[]
  getBusesForLine: (lineId: string) => ActiveBus[]
  operator?: "Dem Dikk" | "Tata" | "BRT" | "TER"
}

export function LinePanel({
  selectedLine,
  onSelectLine,
  buses,
  getBusesForLine,
  operator,
}: LinePanelProps) {
  const filteredLines = operator
    ? BUS_LINES.filter((l) => l.operator === operator)
    : BUS_LINES

  if (selectedLine) {
    const line = BUS_LINES.find((l) => l.id === selectedLine)
    if (!line) return null
    const lineBuses = getBusesForLine(selectedLine)

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: line.color, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: "14px", flexShrink: 0 }}>
              {line.number}
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 600, fontSize: "14px", color: "var(--text-primary)" }}>{line.name}</p>
              <p style={{ margin: 0, fontSize: "11px", color: "var(--text-secondary)" }}>{line.operator} · {line.fare} CFA</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onSelectLine(null)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
          {[
            { icon: <Bus size={14} />, value: lineBuses.length, label: "Bus actifs" },
            { icon: <Users size={14} />, value: lineBuses.reduce((s, b) => s + b.scoutCount, 0), label: "Éclaireurs" },
            { icon: null, value: `${line.fare} F`, label: "Tarif CFA" },
          ].map((stat, i) => (
            <div key={i} style={{ background: "var(--bg-glass)", borderRadius: "10px", padding: "10px 6px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", border: "1px solid var(--border)" }}>
              {stat.icon && <div style={{ color: line.color }}>{stat.icon}</div>}
              <span style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)" }}>{stat.value}</span>
              <span style={{ fontSize: "10px", color: "var(--text-secondary)" }}>{stat.label}</span>
            </div>
          ))}
        </div>

        <div>
          <p style={{ margin: "0 0 10px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "var(--text-secondary)" }}>
            Arrêts ({line.stops.length})
          </p>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {line.stops.map((stop, idx) => (
              <div key={stop.id} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: line.color, border: "2px solid var(--bg-card)", flexShrink: 0 }} />
                  {idx < line.stops.length - 1 && (
                    <div style={{ width: "2px", height: "24px", background: line.color, opacity: 0.3 }} />
                  )}
                </div>
                <div style={{ paddingBottom: "8px" }}>
                  <p style={{ margin: 0, fontSize: "13px", fontWeight: 500, color: "var(--text-primary)" }}>{stop.name}</p>
                  {lineBuses.some((b) => b.nextStop === stop.name) && (
                    <span style={{ fontSize: "10px", fontWeight: 700, color: line.color, background: `${line.color}20`, borderRadius: "4px", padding: "1px 6px", display: "inline-block", marginTop: "2px" }}>
                      Bus en approche
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <p style={{ margin: "0 0 6px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "var(--text-secondary)" }}>
        {operator ?? "Toutes les"} lignes ({filteredLines.length})
      </p>
      {filteredLines.map((line) => {
        const lineBuses = getBusesForLine(line.id)
        return (
          <button
            key={line.id}
            onClick={() => onSelectLine(line.id)}
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "12px", 
              padding: "12px", 
              borderRadius: "12px", 
              border: "1px solid var(--border)", 
              background: "var(--bg-card)", 
              cursor: "pointer", 
              transition: "all 0.2s", 
              textAlign: "left", 
              width: "100%" 
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-glass)" }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-card)" }}
          >
            <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: line.color, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: "14px", flexShrink: 0 }}>
              {line.number}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: "0 0 3px", fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {line.name}
              </p>
              <div style={{ display: "flex", gap: "8px", fontSize: "11px", color: "var(--text-secondary)" }}>
                <span style={{ background: "var(--bg)", borderRadius: "4px", padding: "1px 6px", fontWeight: 600 }}>
                  {line.fare} CFA
                </span>
                <span>{line.stops.length} arrêts</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", background: `${line.color}20`, borderRadius: "6px", padding: "4px 8px" }}>
                <Bus size={11} color={line.color} />
                <span style={{ fontSize: "12px", fontWeight: 700, color: line.color }}>{lineBuses.length}</span>
              </div>
              <ChevronRight size={14} color="var(--text-muted)" />
            </div>
          </button>
        )
      })}
    </div>
  )
}
