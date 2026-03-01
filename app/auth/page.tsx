"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bus, Eye, EyeOff, User, Mail, Lock, Shuffle, ArrowRight } from "lucide-react"
import { signIn, signUp, generateTrackingName } from "@/lib/firebase-auth"
import { isFirebaseConfigured } from "@/lib/firebase"

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [trackingName, setTrackingName] = useState(generateTrackingName())
  const [phone, setPhone] = useState("")
  const [otpStep, setOtpStep] = useState(false)
  const [otpSent, setOtpSent] = useState("")
  const [otpInput, setOtpInput] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const configured = isFirebaseConfigured()

  const handleSubmitInfo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!configured) {
      router.push("/")
      return
    }

    if (mode === "login") {
      setLoading(true)
      setError("")
      try {
        await signIn(email, password)
        window.location.href = "/"
      } catch (err: unknown) {
        handleAuthError(err)
      } finally {
        setLoading(false)
      }
    } else {
      // Registration: Move to OTP step
      setLoading(true)
      setError("")
      // SIMULATE SENDING OTP (For production: integrate Firebase Phone Auth)
      const mockOtp = Math.floor(100000 + Math.random() * 900000).toString()
      console.log(`[AUTH DEMO] OTP SEND TO ${phone}: ${mockOtp}`)
      
      setTimeout(() => {
        setOtpSent(mockOtp)
        setOtpStep(true)
        setLoading(false)
        alert(`DEMO OTP envoyé (regardez la console) : ${mockOtp}`)
      }, 1000)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otpInput !== otpSent) {
      setError("Code OTP incorrect.")
      return
    }

    setLoading(true)
    setError("")
    try {
      // Now finally sign up with firebase and add phone
      await signUp(email, password, trackingName, phone)
      window.location.href = "/"
    } catch (err: unknown) {
      handleAuthError(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAuthError = (err: unknown) => {
    const msg = err instanceof Error ? err.message : "Une erreur est survenue"
    if (msg === "FIREBASE_NOT_CONFIGURED" || msg.includes("configuration-not-found") || msg.includes("app-not-authorized")) {
      router.push("/")
      return
    }
    if (msg.includes("email-already-in-use")) setError("Cet email est déjà utilisé.")
    else if (msg.includes("wrong-password") || msg.includes("invalid-credential")) setError("Email ou mot de passe incorrect.")
    else if (msg.includes("weak-password")) setError("Mot de passe trop faible (min. 6 caractères).")
    else if (msg.includes("invalid-email")) setError("Adresse email invalide.")
    else setError("Erreur : " + msg)
  }

  return (
    <div className="auth-page">
      {/* Background */}
      <div className="auth-bg" />

      <div className="auth-container">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <Bus size={32} color="white" />
          </div>
          <h1 className="auth-logo-title">DakarBus</h1>
          <p className="auth-logo-sub">Transport communautaire en temps réel</p>
        </div>

        {/* Card */}
        <div className="auth-card">
          {/* Tab switcher */}
          {!otpStep && (
            <div className="auth-tabs">
              <button
                className={`auth-tab ${mode === "login" ? "auth-tab-active" : ""}`}
                onClick={() => { setMode("login"); setError("") }}
              >
                Connexion
              </button>
              <button
                className={`auth-tab ${mode === "register" ? "auth-tab-active" : ""}`}
                onClick={() => { setMode("register"); setError("") }}
              >
                Inscription
              </button>
            </div>
          )}

          {!configured && (
            <div className="auth-demo-banner">
              ⚠️ Mode démo — Firebase non configuré. <strong>Appuyez sur Continuer</strong> pour accéder à l&apos;app.
            </div>
          )}

          {!otpStep ? (
            <form onSubmit={handleSubmitInfo} className="auth-form">
              {/* Email */}
              <div className="auth-field">
                <label className="auth-label">
                  <Mail size={14} /> Email
                </label>
                <input
                  type="email"
                  className="auth-input"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required={configured}
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div className="auth-field">
                <label className="auth-label">
                  <Lock size={14} /> Mot de passe
                </label>
                <div className="auth-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="auth-input auth-input-pw"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={configured}
                    minLength={6}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="auth-pw-toggle"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Phone and Tracking Name (register only) */}
              {mode === "register" && (
                <>
                  <div className="auth-field">
                    <label className="auth-label">
                      <Lock size={14} /> Téléphone (pour vérification OTP)
                    </label>
                    <input
                      type="tel"
                      className="auth-input"
                      placeholder="+221 77 000 00 00"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div className="auth-field">
                    <label className="auth-label">
                      <User size={14} /> Nom de tracking (affiché sur la carte)
                    </label>
                    <div className="auth-input-wrapper">
                      <input
                        type="text"
                        className="auth-input auth-input-pw"
                        placeholder="Mon pseudo"
                        value={trackingName}
                        onChange={(e) => setTrackingName(e.target.value)}
                        required
                        maxLength={20}
                      />
                      <button
                        type="button"
                        onClick={() => setTrackingName(generateTrackingName())}
                        className="auth-pw-toggle"
                        title="Générer un nom aléatoire"
                      >
                        <Shuffle size={16} />
                      </button>
                    </div>
                    <p className="auth-hint">Ce nom apparaîtra sur la carte quand vous êtes en mode éclaireur</p>
                  </div>
                </>
              )}

              {/* Error */}
              {error && <div className="auth-error">{error}</div>}

              {/* Submit */}
              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? (
                  <span className="auth-spinner" />
                ) : (
                  <>
                    {!configured ? "Continuer en démo" : mode === "login" ? "Se connecter" : "Suivant"}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="auth-form flex flex-col gap-6">
              <div className="text-center text-[#f0f4f8]">
                <h2 className="text-xl font-bold mb-2">Vérification OTP</h2>
                <p className="text-sm text-[#8fa3b8]">Entrez le code à 6 chiffres envoyé au {phone}</p>
              </div>

              <div className="auth-field">
                <input
                  type="text"
                  className="auth-input text-center text-2xl tracking-[0.5em] font-bold h-16"
                  placeholder="••••••"
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  required
                />
              </div>

              {error && <div className="auth-error">{error}</div>}

              <button type="submit" className="auth-submit-btn" disabled={loading || otpInput.length !== 6}>
                {loading ? (
                  <span className="auth-spinner" />
                ) : (
                  <>Valider et Créer mon compte</>
                )}
              </button>

              <button 
                type="button" 
                onClick={() => setOtpStep(false)}
                className="text-sm text-[#8fa3b8] hover:text-white transition-colors"
              >
                Retour
              </button>
            </form>
          )}
        </div>

        <p className="auth-footer">
          En continuant, vous acceptez de&nbsp;
          <a href="#" className="auth-link">partager votre position</a>
          &nbsp;uniquement quand vous êtes en mode éclaireur.
        </p>
      </div>
    </div>
  )
}
