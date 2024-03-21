import { redirect } from 'next/navigation'
import { getSpacesByUserIdentifier } from '~/actions/space'

export default async function Home() {
  const spaces = await getSpacesByUserIdentifier()

  return redirect(spaces[0].slug)
}
