export interface EmailRuleResult {
  id: string
  label: string
  passed: boolean
}

const REINDEER_NAMES = [
  'rudolf',
  'rudolph',
  'kometek',
  'amorek',
  'tancerz',
  'pyszalek',
  'blyskawiczny',
  'profesorek',
  'fircyk',
  'zlosnik',
  'dasher',
  'dancer',
  'prancer',
  'vixen',
  'comet',
  'cupid',
  'donner',
  'blitzen',
]

const BASIC_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u
const EMOJI_REGEX = /\p{Extended_Pictographic}/u

export function evaluateEmailRules(email: string): EmailRuleResult[] {
  const digits = email.match(/\d/g) ?? []
  const digitSum = digits.reduce((sum, d) => sum + Number(d), 0)
  const lower = email.toLowerCase()

  return [
    {
      id: 'basic-format',
      label: 'Poprawny format e-maila (coś@domena.xx, bez spacji)',
      passed: BASIC_EMAIL_REGEX.test(email),
    },
    {
      id: 'min-length',
      label: `Minimum 50 znaków (obecnie: ${email.length}/50)`,
      passed: email.length >= 50,
    },
    {
      id: 'chinese-dog',
      label: 'Musi zawierać słowo „pies” po chińsku (狗)',
      passed: email.includes('狗'),
    },
    {
      id: 'digits-sum-14',
      label: `Minimum 3 cyfry, których suma wynosi dokładnie 14 (cyfr: ${digits.length}, suma: ${digitSum})`,
      passed: digits.length >= 3 && digitSum === 14,
    },
    {
      id: 'emoji',
      label: 'Musi zawierać przynajmniej jedną emotkę (np. 🎄, 🎅, 🐶)',
      passed: EMOJI_REGEX.test(email),
    },
    {
      id: 'reindeer-name',
      label: 'Musi zawierać imię renifera Mikołaja (np. rudolf, dasher, comet)',
      passed: REINDEER_NAMES.some((name) => lower.includes(name)),
    },
    {
      id: 'roman-24',
      label: 'Musi zawierać liczbę rzymską 24 (wielkimi literami: XXIV — jak Wigilia!)',
      passed: email.includes('XXIV'),
    },
    {
      id: 'no-lowercase-e',
      label: 'Zakaz używania małej litery „e” (wielkie „E” jest dozwolone!)',
      passed: email.length > 0 && !email.includes('e'),
    },
    {
      id: 'festive-tld',
      label: 'Domena musi kończyć się na .pl, .ho lub .xmas',
      passed: /\.(pl|ho|xmas)$/i.test(email),
    },
  ]
}

export function isEmailValid(email: string): boolean {
  return evaluateEmailRules(email).every((rule) => rule.passed)
}
