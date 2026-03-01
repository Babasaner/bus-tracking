"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Plus,
  X,
  OctagonAlert,
  ShieldAlert,
  Bus,
  TriangleAlert,
  MapPin,
  ThumbsUp,
  ChevronLeft,
  Send,
  MapPinOff,
} from "lucide-react"
import {
  REPORT_TYPES,
  DAKAR_HOTSPOTS,
  type ReportCategory,
} from "@/lib/report-data"
import { BUS_LINES } from "@/lib/dakar-bus-data"

const CATEGORY_ICONS: Record<ReportCategory, typeof OctagonAlert> = {
  traffic: OctagonAlert,
  control: ShieldAlert,
  bus_status: Bus,
  danger: TriangleAlert,
  new_stop: MapPin,
}

interface ReportMenuProps {
  onSubmitReport: (
    category: ReportCategory,
    subType: string,
    location: { lat: number; lng: number; name: string },
    lineId?: string,
    expiresInHours?: number,
    message?: string
  ) => void
  userLocation: { lat: number; lng: number } | null
}

export function ReportMenu({ onSubmitReport, userLocation }: ReportMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<"categories" | "subtype" | "location">("categories")
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory | null>(null)
  const [selectedSubType, setSelectedSubType] = useState<string>("")
  const [selectedLocation, setSelectedLocation] = useState<string>("")
  const [selectedLineId, setSelectedLineId] = useState<string>("")
  const [expiresInHours, setExpiresInHours] = useState<number>(2)
  const [message, setMessage] = useState<string>("")

  const handleCategorySelect = useCallback((category: ReportCategory) => {
    setSelectedCategory(category)
    const type = REPORT_TYPES.find((t) => t.category === category)
    if (type && type.subTypes.length === 1) {
      setSelectedSubType(type.subTypes[0].value)
      setStep("location")
    } else {
      setStep("subtype")
    }
  }, [])

  const handleSubTypeSelect = useCallback((subType: string) => {
    setSelectedSubType(subType)
    setStep("location")
  }, [])

  const handleSubmit = useCallback(() => {
    if (!selectedCategory || !selectedSubType || !selectedLocation) return

    const hotspot = DAKAR_HOTSPOTS.find((h) => h.name === selectedLocation)
    if (!hotspot) return

    onSubmitReport(
      selectedCategory,
      selectedSubType,
      { lat: hotspot.lat, lng: hotspot.lng, name: hotspot.name },
      selectedCategory === "bus_status" ? selectedLineId || undefined : undefined,
      expiresInHours,
      message.trim() || undefined
    )

    // Reset
    setIsOpen(false)
    setStep("categories")
    setSelectedCategory(null)
    setSelectedSubType("")
    setSelectedLocation("")
    setSelectedLineId("")
    setExpiresInHours(2)
    setMessage("")
  }, [selectedCategory, selectedSubType, selectedLocation, selectedLineId, onSubmitReport])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setStep("categories")
    setSelectedCategory(null)
    setSelectedSubType("")
    setSelectedLocation("")
    setSelectedLineId("")
    setExpiresInHours(2)
    setMessage("")
  }, [])

  const handleBack = useCallback(() => {
    if (step === "location") {
      const type = REPORT_TYPES.find((t) => t.category === selectedCategory)
      if (type && type.subTypes.length === 1) {
        setStep("categories")
        setSelectedCategory(null)
      } else {
        setStep("subtype")
      }
      setSelectedLocation("")
      setSelectedLineId("")
      setExpiresInHours(2)
      setMessage("")
    } else if (step === "subtype") {
      setStep("categories")
      setSelectedCategory(null)
      setSelectedSubType("")
    }
  }, [step, selectedCategory])

  const currentType = selectedCategory
    ? REPORT_TYPES.find((t) => t.category === selectedCategory)
    : null

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        disabled={!userLocation}
        className="flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-transform hover:scale-105"
        style={{
          background: "rgba(220, 38, 38, 0.85)", 
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.8)",
          color: "white",
          opacity: userLocation ? 1 : 0.6
        }}
        size="icon"
      >
        {userLocation ? (
          <Plus className="h-7 w-7 text-[#ffffff]" />
        ) : (
          <MapPinOff className="h-6 w-6 text-[#ffffff]" />
        )}
        <span className="sr-only">Déclarer un incident</span>
      </Button>
    )
  }

  return (
    <div className="w-[300px] rounded-2xl border border-white/10 bg-[var(--bg-card)] shadow-2xl md:w-[340px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          {step !== "categories" && (
            <button onClick={handleBack} className="text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          <h3 className="font-sans text-sm font-bold text-foreground">
            {step === "categories" && "Déclarer un incident"}
            {step === "subtype" && currentType?.label}
            {step === "location" && "Localisation de l'incident"}
          </h3>
        </div>
        <button onClick={handleClose} className="text-muted-foreground hover:text-foreground">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Step 1: Category grid */}
      {step === "categories" && (
        <div className="grid grid-cols-3 gap-2 p-4">
          {REPORT_TYPES.map((type) => {
            const Icon = CATEGORY_ICONS[type.category]
            return (
              <button
                key={type.category}
                onClick={() => handleCategorySelect(type.category)}
                className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-3 transition-all hover:border-primary/30 hover:shadow-sm"
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${type.color}15` }}
                >
                  <Icon className="h-5 w-5" style={{ color: type.color }} />
                </div>
                <span className="font-sans text-[11px] font-medium text-foreground text-center leading-tight">
                  {type.label}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* Step 2: Sub-type selection */}
      {step === "subtype" && currentType && (
        <div className="flex flex-col gap-2 p-4">
          {currentType.subTypes.map((sub) => (
            <button
              key={sub.value}
              onClick={() => handleSubTypeSelect(sub.value)}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 text-left transition-all hover:border-primary/30 hover:shadow-sm"
            >
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: `${currentType.color}15` }}
              >
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: currentType.color }}
                />
              </div>
              <span className="font-sans text-sm font-medium text-foreground">
                {sub.label}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Step 3: Location + optional line + submit */}
      {step === "location" && (
        <div className="flex flex-col gap-3 p-4">
          <div>
            <label className="mb-1.5 block font-sans text-xs font-semibold text-foreground">
              Lieu de l'incident
            </label>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-full font-sans bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-primary)]">
                <SelectValue placeholder="Choisir un lieu..." />
              </SelectTrigger>
              <SelectContent>
                {DAKAR_HOTSPOTS.map((spot) => (
                  <SelectItem key={spot.name} value={spot.name}>
                    {spot.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCategory === "bus_status" && (
            <div>
              <label className="mb-1.5 block font-sans text-xs font-semibold text-foreground">
                Ligne de bus concernée (optionnel)
              </label>
              <Select value={selectedLineId} onValueChange={setSelectedLineId}>
                <SelectTrigger className="w-full font-sans">
                  <SelectValue placeholder="Choisir une ligne..." />
                </SelectTrigger>
                <SelectContent>
                  {BUS_LINES.map((line) => (
                    <SelectItem key={line.id} value={line.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-sm"
                          style={{ backgroundColor: line.color }}
                        />
                        <span>Ligne {line.number}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <label className="mb-1.5 block font-sans text-xs font-semibold text-foreground">
              Durée de validité
            </label>
            <Select value={expiresInHours.toString()} onValueChange={(v) => setExpiresInHours(Number(v))}>
              <SelectTrigger className="w-full font-sans">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 heure</SelectItem>
                <SelectItem value="2">2 heures</SelectItem>
                <SelectItem value="4">4 heures</SelectItem>
                <SelectItem value="12">12 heures</SelectItem>
              </SelectContent>
            </Select>
            <p className="mt-1 font-sans text-[10px] text-muted-foreground">
              Le signalement sera automatiquement archivé après cette période.
            </p>
          </div>

          <div>
            <label className="mb-1.5 block font-sans text-xs font-semibold text-foreground">
              Précisions (optionnel)
            </label>
            <textarea
              className="w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 font-sans text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-[var(--text-primary)]"
              placeholder="Ex: Travaux en cours sur la voie de droite..."
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ resize: "none" }}
            />
          </div>

          {/* Preview */}
          {selectedLocation && currentType && (
            <div className="rounded-lg border border-border bg-secondary/50 p-3">
              <p className="font-sans text-[11px] text-muted-foreground">
                Résumé du signalement :{" "}
                <span className="font-semibold text-foreground">
                  {currentType.label}
                  {selectedSubType && (
                    <>
                      {" - "}
                      {currentType.subTypes.find((s) => s.value === selectedSubType)?.label}
                    </>
                  )}
                </span>{" "}
                à{" "}
                <span className="font-semibold text-foreground">
                  {selectedLocation}
                </span>
              </p>
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={!selectedLocation}
            className="w-full gap-2 font-sans"
            style={{ backgroundColor: currentType?.color || undefined }}
            size="lg"
          >
            <Send className="h-4 w-4" />
            <span className="text-[#ffffff]">Publier le signalement</span>
          </Button>
        </div>
      )}
    </div>
  )
}
