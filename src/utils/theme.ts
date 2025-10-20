export type SubjectId = 'akhlak' | 'feqah'

export interface SubjectTheme {
  name: string
  // Tailwind class tokens
  gradientFrom: string
  gradientTo: string
  primaryBg: string
  primaryText: string
  accent: string
  badgeBg: string
  badgeText: string
  badgeBorder: string
}

const THEMES: Record<SubjectId, SubjectTheme> = {
  akhlak: {
    name: 'Akhlak',
    gradientFrom: 'from-sky-50',
    gradientTo: 'to-sky-100',
    primaryBg: 'bg-sky-50',
    primaryText: 'text-sky-700',
    accent: 'bg-blue-500',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-700',
    badgeBorder: 'border-blue-200',
  },
  feqah: {
    name: 'Feqah',
    gradientFrom: 'from-emerald-50',
    gradientTo: 'to-emerald-100',
    primaryBg: 'bg-emerald-50',
    primaryText: 'text-emerald-700',
    accent: 'bg-emerald-500',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
  },
}

export function getSubjectTheme(subjectId?: string): SubjectTheme {
  if (subjectId === 'feqah') return THEMES.feqah
  return THEMES.akhlak
}


