"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { MapPin, Loader2, CheckCircle2 } from "lucide-react"
import { submitSuggestion, type SuggestionType } from "@/lib/firebase-suggestions"
import { BUS_LINES } from "@/lib/dakar-bus-data"
import { useReportToast } from "@/components/report-toast" // We'll borrow this hook or implement local toast

export function SuggestionForm({ 
  userLocation, 
  onClose 
}: { 
  userLocation: { lat: number; lng: number } | null
  onClose: () => void 
}) {
  const [type, setType] = useState<SuggestionType>("new_stop")
  const [lineId, setLineId] = useState<string>("")
  const [stopName, setStopName] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const line = BUS_LINES.find(l => l.id === lineId)

    const success = await submitSuggestion({
      type,
      data: {
        lineId: line?.id,
        lineNumber: line?.number,
        stopName: type === "new_stop" ? stopName : undefined,
        description,
        lat: userLocation?.lat,
        lng: userLocation?.lng,
      }
    })

    setIsSubmitting(false)
    if (success) {
      setIsSuccess(true)
      setTimeout(() => {
        onClose()
      }, 2000)
    } else {
      // In a real app we'd use a robust toast system here
      alert("Erreur lors de l'envoi de la suggestion. Êtes-vous connecté ?")
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center gap-3">
        <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-sans font-bold text-foreground">C'est noté !</h3>
          <p className="text-sm font-sans text-muted-foreground mt-1">
            Votre suggestion a été envoyée pour modération. Merci de votre aide !
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
      <div>
        <label className="mb-1.5 block font-sans text-xs font-semibold text-foreground">
          Type de suggestion
        </label>
        <Select value={type} onValueChange={(v) => setType(v as SuggestionType)}>
          <SelectTrigger className="w-full font-sans">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new_stop">Proposer un arrêt manquant</SelectItem>
            <SelectItem value="route_correction">Signaler une erreur d'itinéraire</SelectItem>
            <SelectItem value="missing_route">Proposer une nouvelle ligne</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {type !== "missing_route" && (
        <div>
          <label className="mb-1.5 block font-sans text-xs font-semibold text-foreground">
            Ligne concernée (optionnel)
          </label>
          <Select value={lineId} onValueChange={setLineId}>
            <SelectTrigger className="w-full font-sans">
              <SelectValue placeholder="Choisir une ligne..." />
            </SelectTrigger>
            <SelectContent>
              {BUS_LINES.map((line) => (
                <SelectItem key={line.id} value={line.id}>
                  Ligne {line.number} ({line.operator})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {type === "new_stop" && (
        <div>
          <label className="mb-1.5 block font-sans text-xs font-semibold text-foreground">
            Nom de l'arrêt
          </label>
          <Input 
            value={stopName}
            onChange={e => setStopName(e.target.value)}
            placeholder="Ex: Croisement Cambérène"
            className="font-sans"
            required
          />
        </div>
      )}

      <div>
        <label className="mb-1.5 block font-sans text-xs font-semibold text-foreground">
          Détails ou description
        </label>
        <textarea
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 font-sans text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          placeholder={type === "route_correction" ? "L'arrêt X n'existe plus..." : "Précisions..."}
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required={type !== "new_stop"}
          style={{ resize: "none" }}
        />
      </div>

      {userLocation && (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/30 p-2.5">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="font-sans text-xs text-muted-foreground">
            Position actuelle jointe automatiquement
          </span>
        </div>
      )}

      <div className="flex gap-2 mt-2">
        <Button 
          type="button" 
          variant="outline" 
          className="flex-1 font-sans"
          onClick={onClose}
        >
          Annuler
        </Button>
        <Button 
          type="submit" 
          className="flex-1 font-sans"
          disabled={isSubmitting || (type === "new_stop" && !stopName) || (type !== "new_stop" && !description)}
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Envoyer"}
        </Button>
      </div>
    </form>
  )
}
