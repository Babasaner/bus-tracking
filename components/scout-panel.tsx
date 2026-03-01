"use client"

import { useState, useCallback } from "react"
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
  Radio,
  Shield,
  ShieldCheck,
  AlertTriangle,
  Navigation,
  Zap,
  MapPinOff,
} from "lucide-react"
import { BUS_LINES } from "@/lib/dakar-bus-data"

interface ScoutPanelProps {
  isScoutMode: boolean
  scoutLineId: string | null
  startScout: (lineId: string) => void
  stopScout: () => void
  userLocation: { lat: number; lng: number } | null
}

export function ScoutPanel({
  isScoutMode,
  scoutLineId,
  startScout,
  stopScout,
  userLocation,
}: ScoutPanelProps) {
  const [selectedLineForScout, setSelectedLineForScout] = useState<string>("")

  const handleStartScout = useCallback(() => {
    if (selectedLineForScout) {
      startScout(selectedLineForScout)
    }
  }, [selectedLineForScout, startScout])

  const scoutLine = scoutLineId
    ? BUS_LINES.find((l) => l.id === scoutLineId)
    : null

  if (isScoutMode && scoutLine) {
    return (
      <div className="flex flex-col gap-4">
        {/* Active scouting */}
        <div className="rounded-xl bg-primary/10 p-4">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <Radio className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <p className="font-sans text-sm font-bold text-primary">
                Mode Éclaireur actif
              </p>
              <p className="font-sans text-xs text-muted-foreground">
                Votre position est partagée en direct
              </p>
            </div>
          </div>

          <div className="mb-3 flex items-center gap-2 rounded-lg bg-card p-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded font-sans text-xs font-bold text-card"
              style={{ backgroundColor: scoutLine.color }}
            >
              {scoutLine.number}
            </div>
            <div>
              <p className="font-sans text-sm font-medium text-foreground">
                Ligne {scoutLine.number}
              </p>
              <p className="font-sans text-xs text-muted-foreground text-ellipsis overflow-hidden whitespace-nowrap max-w-[180px]">
                {scoutLine.name}
              </p>
            </div>
          </div>

          <div className="mb-3 grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-card p-2 text-center">
              <Navigation className="mx-auto mb-1 h-4 w-4 text-primary" />
              <p className="font-sans text-[10px] text-muted-foreground">Position GPS</p>
              <p className="font-sans text-[10px] font-medium text-foreground">
                {userLocation
                  ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`
                  : "Localisation..."}
              </p>
            </div>
            <div className="rounded-lg bg-card p-2 text-center">
              <Zap className="mx-auto mb-1 h-4 w-4 text-accent" />
              <p className="font-sans text-[10px] text-muted-foreground">Statut</p>
              <p className="font-sans text-[10px] font-bold text-primary">
                EN DIRECT
              </p>
            </div>
          </div>

          <Button
            onClick={stopScout}
            variant="destructive"
            className="w-full font-sans"
          >
            Arrêter le partage
          </Button>
        </div>

        {/* Anti-fraud info */}
        <div className="rounded-xl border border-border bg-card p-3">
          <div className="mb-2 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <p className="font-sans text-xs font-semibold text-foreground">
              Vérification de conformité
            </p>
          </div>
          <ul className="flex flex-col gap-1.5">
            <li className="flex items-start gap-2">
              <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <p className="font-sans text-[11px] text-muted-foreground">
                Vitesse GPS vérifiée (normes urbaines)
              </p>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <p className="font-sans text-[11px] text-muted-foreground">
                Position comparée à l'itinéraire officiel
              </p>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <p className="font-sans text-[11px] text-muted-foreground text-red-500 font-medium">
                Arrêt automatique si déviation constatée
              </p>
            </li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Hero */}
      <div className="rounded-xl bg-primary/5 p-4 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Radio className="h-7 w-7 text-primary" />
        </div>
        <h3 className="mb-1 font-sans text-base font-bold text-foreground">
          Devenir Éclaireur
        </h3>
        <p className="font-sans text-xs text-muted-foreground leading-relaxed">
          Partagez votre trajet pour aider la communauté à localiser les bus en temps réel.
        </p>
      </div>

      {/* Select line */}
      <div style={{ opacity: userLocation ? 1 : 0.5, pointerEvents: userLocation ? "auto" : "none" }}>
        <label className="mb-1.5 block font-sans text-xs font-semibold text-foreground">
          Sélectionnez votre ligne
        </label>
        <Select
          value={selectedLineForScout}
          onValueChange={setSelectedLineForScout}
          disabled={!userLocation}
        >
          <SelectTrigger className="w-full font-sans bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-primary)]">
            <SelectValue placeholder={userLocation ? "Choisir une ligne..." : "Localisation requise..."} />
          </SelectTrigger>
          <SelectContent>
            {BUS_LINES.map((line) => (
              <SelectItem key={line.id} value={line.id}>
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-sm"
                    style={{ backgroundColor: line.color }}
                  />
                  <span className="font-sans">
                    Ligne {line.number} - {line.name}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!userLocation && (
        <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3 border border-red-500/20">
          <MapPinOff className="h-4 w-4 text-red-500" />
          <p className="font-sans text-[11px] font-bold text-red-500">
            Activation du GPS obligatoire pour cette fonction
          </p>
        </div>
      )}

      {/* Start button */}
      <Button
        onClick={handleStartScout}
        disabled={!selectedLineForScout || !userLocation}
        className="w-full gap-2 bg-primary font-sans text-primary-foreground hover:bg-primary/90"
        size="lg"
      >
        <Radio className="h-4 w-4" />
        {"Je suis dans ce bus"}
      </Button>

      {/* Security note */}
      <div className="flex items-start gap-2 rounded-lg border border-border bg-secondary/50 p-3">
        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <div>
          <p className="font-sans text-xs font-semibold text-foreground">
            Confidentialité garantie
          </p>
          <p className="font-sans text-[11px] text-muted-foreground leading-relaxed">
            Seule la position du bus est diffusée. Vos données personnelles restent anonymes et protégées.
          </p>
        </div>
      </div>

      {/* How it works */}
      <div>
        <p className="mb-3 font-sans text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Comment ça marche ?
        </p>
        <div className="flex flex-col gap-3">
          {[
            {
              step: "1",
              title: "Montez à bord",
              desc: "Choisissez la ligne de bus que vous empruntez.",
            },
            {
              step: "2",
              title: "Activez le mode",
              desc: "Appuyez sur 'Je suis dans ce bus' pour démarrer.",
            },
            {
              step: "3",
              title: "Aidez les autres",
              desc: "La position du bus est partagée jusqu'à votre descente.",
            },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary font-sans text-xs font-bold text-primary-foreground">
                {item.step}
              </div>
              <div>
                <p className="font-sans text-sm font-semibold text-foreground">
                  {item.title}
                </p>
                <p className="font-sans text-xs text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
