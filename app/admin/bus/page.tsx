"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Bus, Plus, Pencil, Trash2, Loader2, RefreshCw } from "lucide-react"
import type { BusLine } from "@/lib/dakar-bus-data"
import { getBusLinesFromFirestore, addBusLineToFirestore, deleteBusLineFromFirestore } from "@/lib/firebase-bus"
import { useToast } from "@/hooks/use-toast"

export default function AdminBusPage() {
  const [lines, setLines] = useState<BusLine[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  // Form states
  const [number, setNumber] = useState("")
  const [name, setName] = useState("")
  const [operator, setOperator] = useState<"Dem Dikk" | "Tata">("Dem Dikk")
  const [fare, setFare] = useState("200")

  useEffect(() => {
    loadLines()
  }, [])

  async function loadLines() {
    setLoading(true)
    try {
      const data = await getBusLinesFromFirestore()
      setLines(data)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddLine(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const color = operator === "Dem Dikk" ? "#1B6B3A" : "#E85D04"
      const autoReturn = (document.getElementById("autoReturn") as HTMLInputElement)?.checked
      
      const newLine: Omit<BusLine, "id"> = {
        number,
        name,
        operator,
        fare: parseInt(fare),
        color,
        stops: [], // Initially empty
        returnStops: autoReturn ? [] : undefined // Marker for return trip logic
      }

      await addBusLineToFirestore(newLine)
      toast({
        title: "Succès",
        description: "La ligne a été ajoutée avec succès.",
      })
      setOpen(false)
      loadLines()
      // Reset form
      setNumber("")
      setName("")
      setFare("200")
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter la ligne.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Voulez-vous vraiment supprimer cette ligne ?")) return
    try {
      await deleteBusLineFromFirestore(id)
      toast({
        title: "Supprimé",
        description: "La ligne a été supprimée.",
      })
      await loadLines()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la ligne.",
      })
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bus className="text-[#2d9d5c]" />
            Lignes de Bus
          </h1>
          <p className="text-sm text-[#8fa3b8]">Gérer les lignes Dem Dikk et Tata.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadLines}
            disabled={loading}
          >
            <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#2d9d5c] hover:bg-[#1b6b3a] text-white flex items-center gap-2">
                <Plus size={16} />
                Ajouter une ligne
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1a2535] border-white/10 text-white">
              <DialogHeader>
                <DialogTitle>Ajouter une nouvelle ligne</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddLine} className="space-y-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="number">Numéro de ligne</Label>
                  <Input 
                    id="number" 
                    placeholder="ex: 121, 10, P4..." 
                    value={number}
                    onChange={e => setNumber(e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Itinéraire / Nom</Label>
                  <Input 
                    id="name" 
                    placeholder="ex: Parcelles -> Plateau" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="operator">Opérateur</Label>
                  <Select value={operator} onValueChange={(v: any) => setOperator(v)}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Choisir un opérateur" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a2535] border-white/10 text-white">
                      <SelectItem value="Dem Dikk">Dem Dikk</SelectItem>
                      <SelectItem value="Tata">Tata</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="fare">Tarif (FCFA)</Label>
                  <Input 
                    id="fare" 
                    type="number" 
                    value={fare}
                    onChange={e => setFare(e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                    required
                  />
                </div>
                <div className="flex items-center space-x-2 py-2">
                  <input 
                    type="checkbox" 
                    id="autoReturn" 
                    className="size-4 rounded border-white/10 bg-white/5"
                    defaultChecked
                  />
                  <Label htmlFor="autoReturn" className="text-sm font-medium">Générer automatiquement le retour (ordre inverse)</Label>
                </div>
                <DialogFooter>
                  <Button 
                    type="submit" 
                    className="bg-[#2d9d5c] hover:bg-[#1b6b3a] text-white w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : "Créer la ligne"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#1a2535] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#8fa3b8]">Chargement des lignes...</div>
        ) : lines.length === 0 ? (
          <div className="p-8 text-center text-[#8fa3b8]">Aucune ligne trouvée.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white">
              <thead className="bg-white/5 text-xs uppercase text-[#8fa3b8]">
                <tr>
                  <th className="px-6 py-3">Numéro</th>
                  <th className="px-6 py-3">Nom</th>
                  <th className="px-6 py-3">Opérateur</th>
                  <th className="px-6 py-3">Tarif</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {lines.map((line) => (
                  <tr key={line.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-bold" style={{ color: line.color }}>{line.number}</td>
                    <td className="px-6 py-4">{line.name}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-white/10 px-2 py-1 text-xs">
                        {line.operator}
                      </span>
                    </td>
                    <td className="px-6 py-4">{line.fare} FCFA</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[#3b82f6] hover:text-white mr-3 transition-colors">
                        <Pencil size={18} />
                      </button>
                      <button onClick={() => handleDelete(line.id)} className="text-[#ef4444] hover:text-white transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
