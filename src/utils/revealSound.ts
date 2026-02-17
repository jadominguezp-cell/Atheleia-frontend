/**
 * Sonido característico de "revelación" para Aletheia.
 * Usa Web Audio API: dos notas ascendentes (revelación/claridad).
 * Opcional: colocar public/sounds/reveal.mp3 para usar un audio personalizado.
 */

const REVEAL_FREQS = [523.25, 659.25] // C5, E5 — acorde de “apertura”
const REVEAL_DURATION = 0.2
const REVEAL_GAP = 0.12

let audioContext: AudioContext | null = null

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!audioContext) audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  return audioContext
}

function playTone(ctx: AudioContext, freq: number, startTime: number, duration: number): void {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.frequency.value = freq
  osc.type = 'sine'
  gain.gain.setValueAtTime(0.15, startTime)
  gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration)
  osc.start(startTime)
  osc.stop(startTime + duration)
}

/**
 * Reproduce el sonido de revelación (dos notas ascendentes).
 * Si existe /sounds/reveal.mp3, se puede usar ese archivo en lugar del tono sintético.
 */
export function playRevealSound(): void {
  const ctx = getContext()
  if (!ctx) return
  if (ctx.state === 'suspended') ctx.resume()
  const t = ctx.currentTime
  playTone(ctx, REVEAL_FREQS[0], t, REVEAL_DURATION)
  playTone(ctx, REVEAL_FREQS[1], t + REVEAL_DURATION + REVEAL_GAP, REVEAL_DURATION)
}

/**
 * Intenta reproducir un audio personalizado desde /sounds/reveal.mp3.
 * Si falla o no existe, no hace nada (puedes llamar playRevealSound() como fallback).
 */
export function playRevealSoundFromFile(): void {
  try {
    const audio = new Audio('/sounds/reveal.mp3')
    audio.volume = 0.5
    audio.play().catch(() => { /* fallback silencioso */ })
  } catch {
    playRevealSound()
  }
}
