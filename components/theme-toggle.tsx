"use client"

import { useState, useEffect } from "react"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark")

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle("light", savedTheme === "light")
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("light", newTheme === "light")
  }

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 rounded-lg bg-[var(--bg-glass)] p-2 px-3 text-xs font-semibold text-[var(--text-secondary)] transition-all hover:bg-[var(--bg-glass)]/20 hover:text-[var(--text-primary)] border border-[var(--border)]"
      title={theme === "dark" ? "Passer au mode clair" : "Passer au mode sombre"}
    >
      {theme === "dark" ? (
        <>
          <Sun size={14} className="text-amber-400" />
          <span className="text-[var(--text-primary)]">Mode Clair</span>
        </>
      ) : (
        <>
          <Moon size={14} className="text-blue-400" />
          <span className="text-[var(--text-primary)]">Mode Sombre</span>
        </>
      )}
    </button>
  )
}
