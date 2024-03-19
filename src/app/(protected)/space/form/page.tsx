import { getPrices } from '~/actions/services/stripe'
import SpaceFormUI from '~/components/SpaceForm'

export default async function SpaceForm() {
  const prices = await getPrices()
  return <SpaceFormUI prices={prices} />
}
