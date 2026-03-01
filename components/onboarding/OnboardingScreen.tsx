"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const slides = [
  {
    id: 1,
    emoji: "🗺️",
    title: "Carte en direct",
    description: "Voyez tous les bus autour de vous sur une carte interactive en temps réel.",
    bgFrom: "#0f2027",
    bgTo: "#1B6B3A",
    accent: "#2D9D5C",
  },
  {
    id: 2,
    emoji: "🚌",
    title: "Bus Tata & Dem Dikk",
    description: "Choisissez votre opérateur. Les bus Tata en orange, Dem Dikk en vert.",
    bgFrom: "#1a0a00",
    bgTo: "#7C2D12",
    accent: "#E85D04",
  },
  {
    id: 3,
    emoji: "📡",
    title: "Mode Éclaireur",
    description: "Partagez votre position dans le bus pour aider les passagers qui attendent aux arrêts.",
    bgFrom: "#0c1445",
    bgTo: "#1e3a8a",
    accent: "#3B82F6",
  },
  {
    id: 4,
    emoji: "🔔",
    title: "Alertes en temps réel",
    description: "Signalez accidents, embouteillages et pannes. Restez informé des incidents sur votre trajet.",
    bgFrom: "#1a0030",
    bgTo: "#4C1D95",
    accent: "#8B5CF6",
  },
]

interface OnboardingScreenProps {
  onComplete: () => void
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const router = useRouter()
  const slide = slides[currentSlide]

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((s) => s + 1)
    } else {
      onComplete()
      router.push("/auth")
    }
  }

  const handleSkip = () => {
    onComplete()
    router.push("/auth")
  }

  return (
    <div
      className="onboarding-screen"
      style={{
        background: `linear-gradient(160deg, ${slide.bgFrom} 0%, ${slide.bgTo} 100%)`,
      }}
    >
      {/* Skip button */}
      <button onClick={handleSkip} className="onboarding-skip">
        Passer
      </button>

      {/* Slide content */}
      <div className="onboarding-content">
        {/* Big emoji icon */}
        <div
          className="onboarding-emoji-wrapper"
          style={{ background: `${slide.accent}22`, border: `2px solid ${slide.accent}44` }}
        >
          <span className="onboarding-emoji">{slide.emoji}</span>
        </div>

        <h2 className="onboarding-title">{slide.title}</h2>
        <p className="onboarding-desc">{slide.description}</p>
      </div>

      {/* Dots */}
      <div className="onboarding-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className="onboarding-dot"
            style={{
              background: i === currentSlide ? slide.accent : "rgba(255,255,255,0.3)",
              width: i === currentSlide ? "24px" : "8px",
            }}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Next button */}
      <button
        onClick={handleNext}
        className="onboarding-next-btn"
        style={{ background: slide.accent }}
      >
        {currentSlide === slides.length - 1 ? "Commencer 🚀" : "Suivant →"}
      </button>

      {/* Slide counter */}
      <p className="onboarding-counter">
        {currentSlide + 1} / {slides.length}
      </p>
    </div>
  )
}
