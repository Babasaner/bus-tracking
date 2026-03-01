import { Skeleton } from "@/components/ui/skeleton"
import { Bus, LogIn } from "lucide-react"

export function AppSkeleton() {
  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-[#0f1923]">
      {/* Header Skeleton */}
      <header className="relative z-20 flex shrink-0 items-center justify-between border-b border-white/10 bg-[#1a2535]/85 p-3 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="flex h-[38px] w-[38px] items-center justify-center rounded-lg bg-white/10 shadow-sm">
            <Bus size={20} className="text-white/40" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-5 w-24 bg-white/10" />
            <Skeleton className="h-3 w-40 bg-white/5" />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-16 rounded-full bg-white/10" />
          <div className="flex items-center justify-center rounded-lg border border-white/10 bg-white/5 p-2 text-white/40">
            <LogIn size={16} />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="relative flex flex-1 overflow-hidden">
        
        {/* Desktop Sidebar Skeleton */}
        <aside className="relative z-10 hidden w-[360px] shrink-0 flex-col overflow-hidden border-r border-white/10 bg-[#1a2535]/85 backdrop-blur-xl md:flex">
          {/* Operator Switcher */}
          <div className="m-3 flex gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
            <Skeleton className="h-9 w-full rounded-lg bg-white/10" />
            <Skeleton className="h-9 w-full rounded-lg bg-white/5" />
          </div>
          
          {/* Tabs */}
          <div className="mx-3 mt-2 flex gap-0.5 border-b border-white/10 pb-2">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-12 flex-1 rounded-md bg-white/5" />
            ))}
          </div>

          {/* List Content */}
          <div className="flex max-h-full flex-col gap-2 overflow-hidden p-3 pt-4">
            <Skeleton className="mb-2 h-3 w-20 bg-white/10" />
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex h-[70px] w-full items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3">
                <Skeleton className="h-11 w-11 shrink-0 rounded-lg bg-white/10" />
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="h-4 w-3/4 bg-white/10" />
                  <Skeleton className="h-3 w-1/2 bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Map Area */}
        <main className="relative flex flex-1 items-center justify-center bg-[#0a1118]">
          {/* Shimmer effect over a dark background */}
          <div className="absolute inset-0 bg-[#0f1923]">
            <div className="h-full w-full animate-pulse bg-gradient-to-tr from-transparent via-[#1a2535]/40 to-transparent" />
          </div>
          
          <div className="z-10 flex flex-col items-center gap-4">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1b6b3a]/20 shadow-[0_0_40px_rgba(27,107,58,0.2)]">
              <div className="absolute inset-0 animate-ping rounded-2xl bg-[#2d9d5c]/20" />
              <Bus size={28} className="text-[#2d9d5c]" />
            </div>
            <p className="font-sans text-sm font-medium text-[#8fa3b8] animate-pulse">
              Initialisation DakarBus...
            </p>
          </div>
          
          {/* Mobile Bottom Tabs Skeleton */}
          <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col bg-[#1a2535] md:hidden">
             {/* Operator Strip */}
             <div className="mx-auto flex w-full max-w-sm gap-2 p-2 pb-0">
               <Skeleton className="h-8 w-1/2 rounded-full bg-white/10" />
               <Skeleton className="h-8 w-1/2 rounded-full bg-white/5" />
             </div>
             {/* Tabs container */}
             <div className="flex h-16 items-center justify-between px-2 pt-1 pb-safe">
               {[...Array(6)].map((_, i) => (
                 <div key={i} className="flex flex-col items-center gap-1 p-2 w-[16%]">
                   <Skeleton className="h-5 w-5 rounded bg-white/10" />
                   <Skeleton className="h-2 w-full max-w-[24px] rounded bg-white/5" />
                 </div>
               ))}
             </div>
          </div>
        </main>
      </div>
    </div>
  )
}
