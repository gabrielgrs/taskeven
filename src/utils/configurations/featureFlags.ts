type FeatureName = 'GOOGLE_AUTH'

export const isFeatureEnabled = (feature: FeatureName) => {
  const flagString = process.env.NEXT_PUBLIC_FEATURE_FLAGS?.toUpperCase().trim()
  if (!flagString) return false
  return flagString.split(',').includes(feature)
}
