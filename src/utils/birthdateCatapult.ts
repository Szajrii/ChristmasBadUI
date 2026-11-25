export const MIN_BIRTH_YEAR = 1900
export const MAX_BIRTH_YEAR = 2026

export const POLISH_MONTHS = [
  'Styczeń',
  'Luty',
  'Marzec',
  'Kwiecień',
  'Maj',
  'Czerwiec',
  'Lipiec',
  'Sierpień',
  'Wrzesień',
  'Październik',
  'Listopad',
  'Grudzień',
] as const

/**
 * Przelicza moc naciągu katapulty sań (0–100%) na rok urodzenia (2026–1900).
 * 0% = MAX_BIRTH_YEAR (2026), 100% = MIN_BIRTH_YEAR (1900).
 */
export function calculateYearFromPower(power: number): number {
  const clamped = Math.max(0, Math.min(100, power))
  const span = MAX_BIRTH_YEAR - MIN_BIRTH_YEAR
  return Math.round(MAX_BIRTH_YEAR - (clamped / 100) * span)
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

export function getDaysInMonth(month: number, year: number): number {
  if (month < 1 || month > 12) return 31
  if (month === 2) return isLeapYear(year) ? 29 : 28
  if ([4, 6, 9, 11].includes(month)) return 30
  return 31
}

export function clampDayToMonth(day: number, month: number, year: number): number {
  const maxDays = getDaysInMonth(month, year)
  if (day < 1) return maxDays
  if (day > maxDays) return 1
  return day
}

export function wrapMonth(month: number): number {
  if (month < 1) return 12
  if (month > 12) return 1
  return month
}

export function formatBirthdate(day: number, month: number, year: number): string {
  const dd = String(day).padStart(2, '0')
  const mm = String(month).padStart(2, '0')
  return `${dd}.${mm}.${year}`
}
