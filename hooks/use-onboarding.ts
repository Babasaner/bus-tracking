"use client"

import { useState, useEffect } from "react"

const ONBOARDING_KEY = "dakarbus_onboarding_done"

export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const done = localStorage.getItem(ONBOARDING_KEY)
    setShowOnboarding(!done)
    setChecked(true)
  }, [])

  const completeOnboarding = () => {
    localStorage.setItem(ONBOARDING_KEY, "true")
    setShowOnboarding(false)
  }

  return { showOnboarding, completeOnboarding, checked }
}
