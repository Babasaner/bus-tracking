"use client"

import { useState, useCallback, useEffect } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { LinePanel } from "@/components/line-panel"
import { ScoutPanel } from "@/components/scout-panel"
import { RouteCalculator } from "@/components/route-calculator"
import { WaitingPanel } from "@/components/waiting-panel"
import { ReportMenu } from "@/components/report-menu"
import { ReportFeed } from "@/components/report-feed"
import { ReportToast } from "@/components/report-toast"
import { TripHistory } from "@/components/trip-history"
import { SuggestionForm } from "@/components/suggestion-form"
import { OnboardingScreen } from "@/components/onboarding/OnboardingScreen"
import { AppSkeleton } from "@/components/app-skeleton"
import { ThemeToggle } from "@/components/theme-toggle"
import { useOnboarding } from "@/hooks/use-onboarding"
import { useBusSimulation } from "@/hooks/use-bus-simulation"
import { useReports } from "@/hooks/use-reports"
import { useToast } from "@/hooks/use-toast"
import { BUS_LINES, type Operator } from "@/lib/dakar-bus-data"
import type { ActiveBus } from "@/lib/dakar-bus-data"
import {
  Bus,
  Radio,
  Clock,
  Navigation,
  Bell,
  ChevronUp,
  LogIn,
  History,
  MessageSquarePlus,
  ChevronLeft,
  ChevronRight,
  GripVertical
} from "lucide-react"

// Dynamic import for map (needs browser APIs)
const BusMap = dynamic(
  () => import("@/components/bus-map").then((mod) => ({ default: mod.BusMap })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-[var(--bg)]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-transparent border-[var(--primary)]" />
          <p className="text-[13px] font-sans text-[var(--text-secondary)]">
            Chargement de la carte...
          </p>
        </div>
      </div>
    ),
  }
)


const TABS = [
  { id: "lignes", icon: Bus, label: "Réseau de Bus" },
  { id: "attente", icon: Clock, label: "Attente" },
  { id: "trafic", icon: Radio, label: "Infos Trafic" },
  { id: "eclaireur", icon: Navigation, label: "Mode Éclaireur" },
  { id: "alertes", icon: Bell, label: "Incidents Bus" },
]

export default function DakarBusApp() {
  const router = useRouter()
  const { showOnboarding, completeOnboarding, checked } = useOnboarding()
  const [operator, setOperator] = useState<Operator>("Dem Dikk")

  const {
    buses,
    isScoutMode,
    scoutLineId,
    userLocation,
    startScout,
    stopScout,
    getBusesForLine,
    requestLocation,
    isOperatingTime,
  } = useBusSimulation()

  const {
    reports,
    activeReports,
    newReportToast,
    addReport,
    upvoteReport,
    dismissReport,
    setNewReportToast,
  } = useReports()

  const [selectedLine, setSelectedLine] = useState<string | null>(null)
  const [selectedBus, setSelectedBus] = useState<ActiveBus | null>(null)
  const [activeTab, setActiveTab] = useState("lignes")
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false)
  
  // Resizable Sidebar States
  const [sidebarWidth, setSidebarWidth] = useState(360)
  const [isResizing, setIsResizing] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }, [])

  const stopResizing = useCallback(() => {
    setIsResizing(false)
  }, [])

  const resize = useCallback((e: MouseEvent) => {
    if (isResizing) {
      const newWidth = e.clientX
      if (newWidth >= 280 && newWidth <= 600) {
        setSidebarWidth(newWidth)
      }
    }
  }, [isResizing])

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize)
      window.addEventListener("mouseup", stopResizing)
    } else {
      window.removeEventListener("mousemove", resize)
      window.removeEventListener("mouseup", stopResizing)
    }
    return () => {
      window.removeEventListener("mousemove", resize)
      window.removeEventListener("mouseup", stopResizing)
    }
  }, [isResizing, resize, stopResizing])

  const handleSelectLine = useCallback((lineId: string | null) => {
    setSelectedLine(lineId)
  }, [])

  const handleSelectBus = useCallback((bus: ActiveBus) => {
    setSelectedBus(bus)
    const line = BUS_LINES.find((l) => l.id === bus.lineId)
    if (line) setSelectedLine(line.id)
  }, [])

  const openAlertsFeed = useCallback(() => {
    setActiveTab("alertes")
    setMobileSheetOpen(true)
  }, [])

  const accentColor = operator === "Dem Dikk" ? "#2D9D5C" : "#E85D04"
  const accentDim = operator === "Dem Dikk" ? "rgba(45,157,92,0.1)" : "rgba(232,93,4,0.1)"

  const filteredBuses = buses.filter((b) => {
    const line = BUS_LINES.find((l) => l.id === b.lineId)
    return line?.operator === operator
  })

  // Don't render until onboarding state is determined
  if (!checked) return <AppSkeleton />

  if (showOnboarding) {
    return <OnboardingScreen onComplete={completeOnboarding} />
  }

  return (
    <div className="app-root">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="app-header-logo">
          <div className="app-header-icon">
            <Bus size={20} color="white" />
          </div>
          <div>
            <h1 className="app-header-title">DakarBus</h1>
            <p className="app-header-sub">Transport communautaire en temps réel</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <ThemeToggle />
          {activeReports.length > 0 && (
            <button onClick={openAlertsFeed} className="alert-badge">
              <Bell size={12} color="#ef4444" />
              <span className="alert-badge-text">{activeReports.length}</span>
            </button>
          )}
          <div className="app-live-badge">
            <div className="app-live-dot" />
            <span className="app-live-text">{filteredBuses.length} bus</span>
          </div>
          <button
            onClick={() => router.push("/auth")}
            style={{
              background: "var(--bg-glass)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "8px",
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
            }}
            title="Connexion"
          >
            <LogIn size={16} />
          </button>
        </div>
      </header>

      {/* ── Main area ── */}
      <div className="app-content">
        {/* ── Desktop Sidebar ── */}
        <aside 
          className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}
          style={{ '--sidebar-width': `${sidebarWidth}px` } as any}
        >
          {/* Collapse Button */}
          <button 
            className="sidebar-collapse-btn"
            onClick={() => setIsCollapsed(true)}
            title="Réduire"
            style={{ display: isCollapsed ? 'none' : 'flex' }}
          >
            <ChevronLeft size={14} />
          </button>

          {/* Resize Handle */}
          <div 
            className={`resize-handle ${isResizing ? 'active' : ''}`}
            onMouseDown={startResizing}
          >
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20">
              <GripVertical size={12} />
            </div>
          </div>
          {/* Operator switcher */}
          <div className="operator-switcher" style={{ overflowX: "auto", paddingBottom: "4px" }}>
            <button
              className={`operator-btn operator-btn-dem-dikk ${operator === "Dem Dikk" ? "active" : ""}`}
              onClick={() => { setOperator("Dem Dikk"); setSelectedLine(null) }}
            >
              🟢 DDD
            </button>
            <button
              className={`operator-btn operator-btn-tata ${operator === "Tata" ? "active" : ""}`}
              onClick={() => { setOperator("Tata"); setSelectedLine(null) }}
            >
              🟠 Tata
            </button>
            <button
              className={`operator-btn operator-btn-brt ${operator === "BRT" ? "active" : ""}`}
              onClick={() => { setOperator("BRT"); setSelectedLine(null) }}
              style={{ background: operator === "BRT" ? "var(--primary)" : "transparent", color: operator === "BRT" ? "white" : "var(--text-secondary)" }}
            >
              🔴 BRT
            </button>
            <button
              className={`operator-btn operator-btn-ter ${operator === "TER" ? "active" : ""}`}
              onClick={() => { setOperator("TER"); setSelectedLine(null) }}
              style={{ background: operator === "TER" ? "#3b82f6" : "transparent", color: operator === "TER" ? "white" : "var(--text-secondary)" }}
            >
              🔵 TER
            </button>
          </div>

          {/* Tab bar */}
          <div className="sidebar-tabs">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`sidebar-tab ${activeTab === tab.id ? (operator === "Tata" ? "sidebar-tab-tata active" : "active") : ""}`}
              >
                <tab.icon size={16} />
                <span style={{ fontSize: "9px" }}>{tab.label}</span>
                {tab.id === "alertes" && activeReports.length > 0 && (
                  <span className="sidebar-tab-badge">
                    {activeReports.length > 9 ? "9+" : activeReports.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="sidebar-content">
            <ScrollArea className="h-full">
              {activeTab === "lignes" && (
                <LinePanel
                  selectedLine={selectedLine}
                  onSelectLine={handleSelectLine}
                  buses={filteredBuses}
                  getBusesForLine={getBusesForLine}
                  operator={operator}
                />
              )}
              {activeTab === "attente" && (
                <WaitingPanel
                  buses={filteredBuses}
                  onSelectLine={(lineId) => {
                    handleSelectLine(lineId)
                    setActiveTab("lignes")
                  }}
                />
              )}
              {activeTab === "eclaireur" && (
                <ScoutPanel
                  isScoutMode={isScoutMode}
                  scoutLineId={scoutLineId}
                  startScout={startScout}
                  stopScout={stopScout}
                  userLocation={userLocation}
                />
              )}
              {activeTab === "historique" && <TripHistory />}
              {activeTab === "suggerer" && (
                <div className="p-4">
                  <div className="mb-4 rounded-xl border border-primary/20 bg-primary/5 p-4 text-center">
                    <h3 className="font-sans font-bold text-foreground">Aidez-nous à améliorer le réseau</h3>
                    <p className="mt-1 text-xs font-sans text-muted-foreground">
                      Signalez un arrêt manquant ou une erreur d'itinéraire. Vos suggestions seront examinées par notre équipe.
                    </p>
                  </div>
                  <SuggestionForm 
                    userLocation={userLocation} 
                    onClose={() => setActiveTab("lignes")} 
                  />
                </div>
              )}
              {activeTab === "alertes" && (
                <ReportFeed
                  reports={reports}
                  onUpvote={upvoteReport}
                  onDismiss={dismissReport}
                />
              )}
            </ScrollArea>
          </div>
        </aside>

        {/* Expand Button (Only visible when collapsed) */}
        {isCollapsed && (
          <button 
            className="sidebar-expand-btn z-1000"
            onClick={() => {
              console.log("Expand clicked")
              setIsCollapsed(false)
            }}
            title="Agrandir"
          >
            <ChevronRight size={18} />
          </button>
        )}

        {/* ── MAP ── */}
        <main style={{ position: "relative", flex: 1 }}>
          <BusMap
            buses={filteredBuses}
            selectedLine={selectedLine}
            onSelectLine={handleSelectLine}
            onSelectBus={handleSelectBus}
            userLocation={userLocation}
            isScoutMode={isScoutMode}
            reports={activeReports}
          />

          {/* Service Ended Overlay */}
          {!isOperatingTime && (
            <div className="absolute inset-0 z-[8000] flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
              <div className="max-w-[280px] rounded-2xl border border-white/10 bg-[var(--bg-card)]/90 p-6 text-center shadow-2xl backdrop-blur-xl">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20 text-amber-500">
                  <Clock size={24} />
                </div>
                <h3 className="mb-2 text-lg font-bold text-[var(--text-primary)]">Service Terminé</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Les bus circulent de <span className="text-[var(--text-primary)] font-semibold">05:00 à 21:30</span>. 
                  Reprise du service demain matin.
                </p>
              </div>
            </div>
          )}

          {/* Toast */}
          <div style={{ position: "absolute", top: "16px", left: "50%", transform: "translateX(-50%)", zIndex: 14000 }}>
            <ReportToast
              report={newReportToast}
              onDismiss={() => setNewReportToast(null)}
              onOpenFeed={openAlertsFeed}
            />
          </div>

          {/* Scout active indicator */}
          {isScoutMode && (
            <div style={{ position: "absolute", top: "16px", right: "16px", zIndex: 14000 }}>
              <button
                onClick={stopScout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(239,68,68,0.9)",
                  border: "none",
                  borderRadius: "99px",
                  padding: "8px 16px",
                  color: "white",
                  fontSize: "13px",
                  fontWeight: 700,
                  boxShadow: "0 4px 16px rgba(239,68,68,0.4)",
                }}
              >
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "white", animation: "pulse-dot 1.5s infinite" }} />
                Éclaireur actif — Arrêter
              </button>
            </div>
          )}

          {/* FAB buttons (combined responsive) */}
          <div className="absolute right-4 bottom-[124px] z-[14000] flex flex-col gap-4 md:right-8 md:bottom-8">
            <ReportMenu onSubmitReport={addReport} userLocation={userLocation} />
            {!isScoutMode && (
              <button
                onClick={() => { setActiveTab("eclaireur"); setMobileSheetOpen(true) }}
                className="flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-transform hover:scale-105 active:scale-95"
                style={{ 
                  background: "var(--bg-glass)", 
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid var(--border)",
                  color: "var(--primary)",
                }}
                title="Devenir Éclaireur"
              >
                <Radio size={24} />
              </button>
            )}
          </div>
        </main>
      </div>

      {/* ── Mobile Bottom Nav ── */}
      <div className="mobile-bottom-nav">
        {!isOperatingTime && (
          <div className="absolute -top-10 left-0 right-0 flex justify-center p-2 z-50 pointer-events-none">
            <div className="flex items-center gap-2 rounded-full bg-amber-500 px-4 py-1.5 text-[11px] font-bold text-black shadow-lg animate-pulse border border-white/20">
              <Clock size={14} />
              SERVICE DE NUIT — REPRISE À 05:00
            </div>
          </div>
        )}

        {/* Operator strip (mobile) - scrollable if needed */}
        <div className="flex gap-2 p-2 px-3 overflow-x-auto no-scrollbar">
          <button
            className={`whitespace-nowrap flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-bold transition-all ${operator === "Dem Dikk" ? "bg-[var(--primary)] text-white shadow-lg" : "bg-[var(--bg-glass)] text-[var(--text-secondary)]"}`}
            onClick={() => { setOperator("Dem Dikk"); setSelectedLine(null) }}
          >
            🟢 DDD
          </button>
          <button
            className={`whitespace-nowrap flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-bold transition-all ${operator === "Tata" ? "bg-[#e85d04] text-white shadow-lg" : "bg-[var(--bg-glass)] text-[var(--text-secondary)]"}`}
            onClick={() => { setOperator("Tata"); setSelectedLine(null) }}
          >
            🟠 Tata
          </button>
          <button
            className={`whitespace-nowrap flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-bold transition-all ${operator === "BRT" ? "bg-rose-600 text-white shadow-lg" : "bg-[var(--bg-glass)] text-[var(--text-secondary)]"}`}
            onClick={() => { setOperator("BRT"); setSelectedLine(null) }}
          >
            🔴 BRT
          </button>
          <button
            className={`whitespace-nowrap flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-bold transition-all ${operator === "TER" ? "bg-blue-600 text-white shadow-lg" : "bg-[var(--bg-glass)] text-[var(--text-secondary)]"}`}
            onClick={() => { setOperator("TER"); setSelectedLine(null) }}
          >
            🔵 TER
          </button>
        </div>
        
        <div className="flex items-center justify-between p-2 px-3 border-b border-white/5">
           <span className="text-[10px] font-bold text-[#8fa3b8] uppercase tracking-wider">Navigation</span>
           <ThemeToggle />
        </div>

        {/* Tabs */}
        <div className="mobile-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setMobileSheetOpen(true) }}
              className={`mobile-tab ${activeTab === tab.id ? "active" : ""}`}
            >
              <tab.icon size={20} />
              <span>{tab.label}</span>
              {tab.id === "alertes" && activeReports.length > 0 && (
                <span className="mobile-tab-badge">
                  {activeReports.length > 9 ? "9+" : activeReports.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Mobile Mobile Bottom Nav... (FAB block removed here) ── */}

      {/* ── Mobile Sheet ── */}
      <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
        <SheetContent
          side="bottom"
          className="h-[78dvh] rounded-t-2xl"
          style={{ background: "#1a2535", border: "1px solid rgba(255,255,255,0.08)", borderBottom: "none" }}
        >
          <SheetHeader className="pb-2">
            <SheetTitle style={{ color: "#f0f4f8", fontSize: "16px", fontWeight: 700 }}>
              {activeTab === "lignes" && "Lignes de bus"}
              {activeTab === "attente" && "Temps d'attente"}
              {activeTab === "eclaireur" && "Mode Éclaireur"}
              {activeTab === "trafic" && "Infos Trafic"}
              {activeTab === "alertes" && "Alertes Bus"}
            </SheetTitle>
            <SheetDescription style={{ color: "#8fa3b8", fontSize: "12px" }}>
              {activeTab === "lignes" && `Lignes ${operator} — Dakar`}
              {activeTab === "attente" && "Bus en approche en temps réel"}
              {activeTab === "eclaireur" && "Partagez votre position pour aider les usagers"}
              {activeTab === "trafic" && "Embouteillages, accidents et contrôles"}
              {activeTab === "alertes" && "Pannes et états des bus signalés"}
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-full px-1 pb-8">
            {activeTab === "lignes" && (
              <LinePanel
                selectedLine={selectedLine}
                onSelectLine={handleSelectLine}
                buses={filteredBuses}
                getBusesForLine={getBusesForLine}
                operator={operator}
              />
            )}
            {activeTab === "attente" && (
              <WaitingPanel
                buses={filteredBuses}
                onSelectLine={(lineId) => {
                  handleSelectLine(lineId)
                  setActiveTab("lignes")
                  setMobileSheetOpen(false)
                }}
              />
            )}
            {activeTab === "eclaireur" && (
              <ScoutPanel
                isScoutMode={isScoutMode}
                scoutLineId={scoutLineId}
                startScout={startScout}
                stopScout={stopScout}
                userLocation={userLocation}
              />
            )}
            {activeTab === "historique" && <TripHistory />}
            {activeTab === "suggerer" && (
              <div className="p-4">
                <div className="mb-4 rounded-xl border border-primary/20 bg-primary/5 p-4 text-center">
                  <h3 className="font-sans font-bold text-foreground">Aider à améliorer le réseau</h3>
                  <p className="mt-1 text-xs font-sans text-muted-foreground">
                    Signalez un arrêt manquant ou une erreur d'itinéraire.
                  </p>
                </div>
                <SuggestionForm 
                  userLocation={userLocation} 
                  onClose={() => {
                    setActiveTab("lignes")
                    setMobileSheetOpen(false)
                  }} 
                />
              </div>
            )}
            {activeTab === "trafic" && (
              <ReportFeed
                reports={reports.filter(r => r.category === "traffic" || r.category === "control" || r.category === "danger")}
                onUpvote={upvoteReport}
                onDismiss={dismissReport}
              />
            )}
            {activeTab === "alertes" && (
              <ReportFeed
                reports={reports.filter(r => r.category === "bus_status" || r.category === "new_stop")}
                onUpvote={upvoteReport}
                onDismiss={dismissReport}
              />
            )}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  )
}
