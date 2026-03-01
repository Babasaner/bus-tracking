"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  OctagonAlert,
  ShieldAlert,
  Bus,
  TriangleAlert,
  MapPin,
  ThumbsUp,
  Clock,
  Bell,
} from "lucide-react"
import type { Report, ReportCategory } from "@/lib/report-data"
import {
  formatTimeAgo,
  generateNotificationMessage,
  getCategoryHeader,
  REPORT_TYPES,
} from "@/lib/report-data"

const CATEGORY_ICONS: Record<ReportCategory, typeof OctagonAlert> = {
  traffic: OctagonAlert,
  control: ShieldAlert,
  bus_status: Bus,
  danger: TriangleAlert,
  new_stop: MapPin,
}

interface ReportFeedProps {
  reports: Report[]
  onUpvote: (reportId: string) => void
  onDismiss: (reportId: string) => void
  onSelectReport?: (report: Report) => void
}

export function ReportFeed({
  reports,
  onUpvote,
  onDismiss,
  onSelectReport,
}: ReportFeedProps) {
  const activeReports = reports.filter((r) => r.active)

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="rounded-xl bg-destructive/5 p-4 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <Bell className="h-7 w-7 text-destructive" />
        </div>
        <h3 className="mb-1 font-sans text-base font-bold text-foreground">
          Alertes communautaires
        </h3>
        <p className="font-sans text-xs text-muted-foreground leading-relaxed">
          Signalements en temps reel par la communaute DakarBus. Contribuez en
          signalant les evenements autour de vous.
        </p>
      </div>

      {/* Active count */}
      <div className="flex items-center justify-between rounded-lg bg-secondary px-3 py-2">
        <span className="font-sans text-xs font-semibold text-foreground">
          {activeReports.length} alerte{activeReports.length > 1 ? "s" : ""} active{activeReports.length > 1 ? "s" : ""}
        </span>
        <Badge variant="outline" className="font-sans text-[10px]">
          <Clock className="mr-1 h-3 w-3" />
          Temps reel
        </Badge>
      </div>

      {/* Report cards */}
      <div className="flex flex-col gap-2">
        {activeReports.length === 0 && (
          <div className="rounded-xl border border-border bg-secondary/50 p-6 text-center">
            <p className="font-sans text-sm text-muted-foreground">
              Aucune alerte active pour le moment.
            </p>
          </div>
        )}

        {activeReports.map((report) => {
          const type = REPORT_TYPES.find((t) => t.category === report.category)
          if (!type) return null
          const Icon = CATEGORY_ICONS[report.category]
          const header = getCategoryHeader(report)
          const message = generateNotificationMessage(report)

          return (
            <button
              key={report.id}
              onClick={() => onSelectReport?.(report)}
              className="rounded-xl border border-border bg-card p-3 text-left transition-all hover:border-primary/20 hover:shadow-sm"
            >
              {/* Top row: icon + header + time */}
              <div className="mb-2 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${type.color}15` }}
                  >
                    <Icon className="h-4 w-4" style={{ color: type.color }} />
                  </div>
                  <div>
                    <p
                      className="font-sans text-xs font-bold"
                      style={{ color: type.color }}
                    >
                      {header}
                    </p>
                    <p className="font-sans text-[10px] text-muted-foreground">
                      {report.userName} - {formatTimeAgo(report.timestamp)}
                    </p>
                  </div>
                </div>
                {report.lineNumber && (
                  <Badge
                    variant="outline"
                    className="font-sans text-[10px] font-bold shrink-0"
                  >
                    Ligne {report.lineNumber}
                  </Badge>
                )}
              </div>

              {/* Message */}
              <p className="mb-2 font-sans text-xs text-foreground leading-relaxed">
                {message}
              </p>

              {/* Footer: location + upvotes */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 font-sans text-[10px] text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {report.locationName}
                </div>
                <div
                  className="flex items-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation()
                    onUpvote(report.id)
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.stopPropagation()
                      onUpvote(report.id)
                    }
                  }}
                >
                  <ThumbsUp className="h-3 w-3 text-primary" />
                  <span className="font-sans text-[10px] font-semibold text-primary">
                    {report.upvotes}
                  </span>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Info */}
      <div className="rounded-lg bg-secondary/50 p-3">
        <p className="font-sans text-[11px] text-muted-foreground text-center leading-relaxed">
          Les alertes expirent automatiquement apres 45 minutes. Appuyez sur le
          pouce pour confirmer un signalement et aider la communaute.
        </p>
      </div>
    </div>
  )
}
