// Syntetyzator melodii "Last Christmas" oparty na Web Audio API (100% statyczny, bez zewnętrznych MP3).

interface NoteStep {
  freq: number
  beats: number
}

// Kiczowata, rozpoznawalna pętla refrenu "Last Christmas" (C-dur / A-moll)
const MELODY_NOTES: NoteStep[] = [
  // "Last Christmas, I gave you my heart"
  { freq: 659.25, beats: 1.5 }, // E5
  { freq: 659.25, beats: 0.5 }, // E5
  { freq: 587.33, beats: 1 }, // D5
  { freq: 440.0, beats: 1 }, // A4
  { freq: 659.25, beats: 0.5 }, // E5
  { freq: 659.25, beats: 0.5 }, // E5
  { freq: 698.46, beats: 0.5 }, // F5
  { freq: 587.33, beats: 1.5 }, // D5
  { freq: 0, beats: 1 }, // pauza
  // "But the very next day, you gave it away"
  { freq: 587.33, beats: 0.5 }, // D5
  { freq: 587.33, beats: 0.5 }, // D5
  { freq: 523.25, beats: 1 }, // C5
  { freq: 493.88, beats: 1 }, // B4
  { freq: 587.33, beats: 0.5 }, // D5
  { freq: 587.33, beats: 0.5 }, // D5
  { freq: 659.25, beats: 0.5 }, // E5
  { freq: 523.25, beats: 1.5 }, // C5
  { freq: 0, beats: 1 }, // pauza
]

const BEAT_DURATION_MS = 280

export class FestiveAudioPlayer {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private timerId: ReturnType<typeof setTimeout> | null = null
  private noteIndex = 0
  private volumePercent = 100
  private started = false

  start(initialVolumePercent = 100) {
    this.volumePercent = Math.max(0, Math.min(100, initialVolumePercent))
    if (typeof window === 'undefined') return

    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioCtx) return

    if (!this.ctx) {
      this.ctx = new AudioCtx()
      this.masterGain = this.ctx.createGain()
      this.masterGain.connect(this.ctx.destination)
    }

    this.applyGain()

    if (this.ctx.state === 'suspended') {
      void this.ctx.resume().catch(() => {
        // Przeglądarka może wymagać interakcji użytkownika przed odblokowaniem audio
      })
    }

    if (!this.started) {
      this.started = true
      this.scheduleNextNote()
    }
  }

  resumeIfSuspended() {
    if (this.ctx && this.ctx.state === 'suspended') {
      void this.ctx.resume().catch(() => {})
    }
  }

  setVolume(percent: number) {
    this.volumePercent = Math.max(0, Math.min(100, percent))
    this.applyGain()
  }

  stop() {
    if (this.timerId !== null) {
      clearTimeout(this.timerId)
      this.timerId = null
    }
    this.started = false
    if (this.ctx) {
      void this.ctx.close().catch(() => {})
      this.ctx = null
      this.masterGain = null
    }
  }

  private applyGain() {
    if (!this.masterGain || !this.ctx) return
    // Celowo głośne brzmienie przy 100%, liniowo skalowane do 0
    const gainValue = (this.volumePercent / 100) * 0.45
    this.masterGain.gain.setValueAtTime(gainValue, this.ctx.currentTime)
  }

  private scheduleNextNote() {
    if (!this.started || !this.ctx || !this.masterGain) return

    const step = MELODY_NOTES[this.noteIndex % MELODY_NOTES.length]
    this.noteIndex = (this.noteIndex + 1) % MELODY_NOTES.length

    const durationMs = step.beats * BEAT_DURATION_MS

    if (step.freq > 0 && this.ctx.state === 'running' && this.volumePercent > 0) {
      const osc = this.ctx.createOscillator()
      const noteGain = this.ctx.createGain()
      osc.type = 'square'
      osc.frequency.setValueAtTime(step.freq, this.ctx.currentTime)

      const now = this.ctx.currentTime
      const noteSec = Math.max(0.05, durationMs / 1000 - 0.03)
      noteGain.gain.setValueAtTime(0.8, now)
      noteGain.gain.exponentialRampToValueAtTime(0.05, now + noteSec)

      osc.connect(noteGain)
      noteGain.connect(this.masterGain)

      osc.start(now)
      osc.stop(now + noteSec)
    }

    this.timerId = setTimeout(() => {
      this.scheduleNextNote()
    }, durationMs)
  }
}
