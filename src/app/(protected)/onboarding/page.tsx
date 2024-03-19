import { getPrices } from '~/actions/services/stripe'
import OnboardingUI from '~/components/Onboarding'

export default async function OnboardingPage() {
  const prices = await getPrices()
  return <OnboardingUI prices={prices} />
}
