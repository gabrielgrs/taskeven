export function getExperienceByCredits(credits: number, fromRecharge: boolean) {
  const positiveValue = Math.abs(credits)
  if (fromRecharge) return Math.round(positiveValue / 4)
  return positiveValue
}

const MAX_LEVEL = 10

export function getExpPerLevel() {
  return Array.from({ length: MAX_LEVEL }).reduce((acc: number[], _, index) => {
    const exp = Math.round((acc[index - 1] || 100) * 1.5 * 1.1)
    acc.push(exp)
    return acc
  }, [])
}

export function getLevelByExperience(experience: number) {
  const levels = getExpPerLevel()
  const level = levels.findIndex((level) => level >= experience)
  return level >= 0 ? level : MAX_LEVEL
}
