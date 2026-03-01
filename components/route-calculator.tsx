"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Navigation,
  ArrowRight,
  Clock,
  Wallet,
  Bus,
  Route,
} from "lucide-react"
import {
  ALL_STOPS,
  BUS_LINES,
  findConnectingLines,
} from "@/lib/dakar-bus-data"

interface RouteResult {
  lineNumber: string
  lineName: string
  lineColor: string
  operator: string
  fare: number
  fromStop: string
  toStop: string
  stopsCount: number
  estimatedTime: number
}

export function RouteCalculator() {
  const [fromStop, setFromStop] = useState<string>("")
  const [toStop, setToStop] = useState<string>("")
  const [results, setResults] = useState<RouteResult[]>([])
  const [searched, setSearched] = useState(false)

  const handleSearch = () => {
    if (!fromStop || !toStop) return

    const connections = findConnectingLines(fromStop, toStop)
    const routeResults: RouteResult[] = connections.map(
      ({ line, fromIdx, toIdx }) => {
        const stopsCount = Math.abs(toIdx - fromIdx)
        const estimatedTime = stopsCount * 8 // ~8 min per stop average
        return {
          lineNumber: line.number,
          lineName: line.name,
          lineColor: line.color,
          operator: line.operator,
          fare: line.fare,
          fromStop,
          toStop,
          stopsCount,
          estimatedTime,
        }
      }
    )

    setResults(routeResults)
    setSearched(true)
  }

  const sortedStops = [...ALL_STOPS].sort((a, b) =>
    a.name.localeCompare(b.name)
  )

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="rounded-xl bg-accent/10 p-4 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-accent/20">
          <Route className="h-7 w-7 text-accent" />
        </div>
        <h3 className="mb-1 font-sans text-base font-bold text-foreground">
          Calculateur d&apos;itineraire
        </h3>
        <p className="font-sans text-xs text-muted-foreground leading-relaxed">
          Trouvez le bus qui vous emmene a destination avec les tarifs et le
          temps estime.
        </p>
      </div>

      {/* From / To */}
      <div className="flex flex-col gap-3">
        <div>
          <label className="mb-1.5 block font-sans text-xs font-semibold text-foreground">
            Depart
          </label>
          <Select value={fromStop} onValueChange={setFromStop}>
            <SelectTrigger className="w-full font-sans">
              <SelectValue placeholder="Ou etes-vous ?" />
            </SelectTrigger>
            <SelectContent>
              {sortedStops.map((stop) => (
                <SelectItem key={stop.id} value={stop.name}>
                  {stop.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
            <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90" />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block font-sans text-xs font-semibold text-foreground">
            Destination
          </label>
          <Select value={toStop} onValueChange={setToStop}>
            <SelectTrigger className="w-full font-sans">
              <SelectValue placeholder="Ou allez-vous ?" />
            </SelectTrigger>
            <SelectContent>
              {sortedStops
                .filter((s) => s.name !== fromStop)
                .map((stop) => (
                  <SelectItem key={stop.id} value={stop.name}>
                    {stop.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        onClick={handleSearch}
        disabled={!fromStop || !toStop}
        className="w-full gap-2 bg-accent font-sans text-accent-foreground hover:bg-accent/90"
        size="lg"
      >
        <Navigation className="h-4 w-4" />
        Trouver mon bus
      </Button>

      {/* Results */}
      {searched && (
        <div className="flex flex-col gap-2">
          <p className="font-sans text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {results.length > 0
              ? `${results.length} ligne${results.length > 1 ? "s" : ""} trouvee${results.length > 1 ? "s" : ""}`
              : "Aucune ligne directe trouvee"}
          </p>

          {results.length === 0 && (
            <div className="rounded-xl border border-border bg-secondary/50 p-4 text-center">
              <p className="font-sans text-sm text-muted-foreground">
                Aucune ligne directe ne relie ces deux arrets. Essayez avec des
                arrets proches ou un trajet avec correspondance.
              </p>
            </div>
          )}

          {results.map((route, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-lg font-sans text-sm font-bold text-card"
                    style={{ backgroundColor: route.lineColor }}
                  >
                    {route.lineNumber}
                  </div>
                  <div>
                    <p className="font-sans text-sm font-semibold text-foreground">
                      Ligne {route.lineNumber}
                    </p>
                    <p className="font-sans text-xs text-muted-foreground">
                      {route.operator}
                    </p>
                  </div>
                </div>
                <Badge className="bg-accent/10 text-accent font-sans" variant="outline">
                  Direct
                </Badge>
              </div>

              <div className="mb-3 flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1 rounded-md bg-secondary px-2 py-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="font-sans text-muted-foreground">
                    ~{route.estimatedTime} min
                  </span>
                </div>
                <div className="flex items-center gap-1 rounded-md bg-secondary px-2 py-1">
                  <Bus className="h-3 w-3 text-muted-foreground" />
                  <span className="font-sans text-muted-foreground">
                    {route.stopsCount} arrets
                  </span>
                </div>
                <div className="flex items-center gap-1 rounded-md bg-accent/10 px-2 py-1">
                  <Wallet className="h-3 w-3 text-accent" />
                  <span className="font-sans font-semibold text-accent">
                    {route.fare} CFA
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 font-sans text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{route.fromStop}</span>
                <ArrowRight className="h-3 w-3" />
                <span className="font-medium text-foreground">{route.toStop}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Popular routes */}
      {!searched && (
        <div>
          <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Trajets populaires
          </p>
          <div className="flex flex-col gap-2">
            {[
              { from: "Pikine", to: "Plateau" },
              { from: "Grand Yoff", to: "Sandaga" },
              { from: "Ouakam", to: "Colobane" },
              { from: "Parcelles Assainies U26", to: "Place de l'Independance" },
            ].map((route) => (
              <button
                key={`${route.from}-${route.to}`}
                onClick={() => {
                  setFromStop(route.from)
                  setToStop(route.to)
                }}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 text-left transition-all hover:border-accent/30 hover:shadow-sm"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10">
                  <Navigation className="h-3.5 w-3.5 text-accent" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 font-sans text-sm">
                    <span className="font-medium text-foreground">{route.from}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span className="font-medium text-foreground">{route.to}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
