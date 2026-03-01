"use client"

import { useEffect, useState } from "react"
import {
  OctagonAlert,
  ShieldAlert,
  Bus,
  TriangleAlert,
  MapPin,
  X,
} from "lucide-react"
import type { Report, ReportCategory } from "@/lib/report-data"
import {
  getCategoryHeader,
  generateNotificationMessage,
  REPORT_TYPES,
} from "@/lib/report-data"

const CATEGORY_ICONS: Record<ReportCategory, typeof OctagonAlert> = {
  traffic: OctagonAlert,
  control: ShieldAlert,
  bus_status: Bus,
  danger: TriangleAlert,
  new_stop: MapPin,
}

interface ReportToastProps {
  report: Report | null
  onDismiss: () => void
  onOpenFeed?: () => void
}

export function ReportToast({ report, onDismiss, onOpenFeed }: ReportToastProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (report) {
      setVisible(true)
    } else {
      setVisible(false)
    }
  }, [report])

  if (!report || !visible) return null

  const type = REPORT_TYPES.find((t) => t.category === report.category)
  if (!type) return null
  const Icon = CATEGORY_ICONS[report.category]
  const header = getCategoryHeader(report)
  const message = generateNotificationMessage(report)

  return (
    <div
      className="animate-in slide-in-from-top-4 fade-in duration-300 w-full max-w-sm cursor-pointer rounded-xl border border-border bg-card p-3 shadow-2xl"
      onClick={() => {
        onOpenFeed?.()
        onDismiss()
      }}
      role="alert"
    >
      <div className="mb-1.5 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: `${type.color}15` }}
          >
            <Icon className="h-3.5 w-3.5" style={{ color: type.color }} />
          </div>
          <p
            className="font-sans text-xs font-bold"
            style={{ color: type.color }}
          >
            {header}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDismiss()
          }}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <p className="font-sans text-[11px] text-foreground leading-relaxed line-clamp-2">
        {message}
      </p>
      <p className="mt-1 font-sans text-[10px] text-muted-foreground">
        Appuyez pour voir les details
      </p>
    </div>
  )
}
