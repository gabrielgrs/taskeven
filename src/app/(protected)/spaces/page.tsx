import { redirect } from 'next/navigation'
import { getSpacesByUserIdentifier } from '~/actions/space'

export default async function Page() {
  const userSpaces = await getSpacesByUserIdentifier()
  if (userSpaces.length === 0) return redirect('/onboarding')
  const firstSpace = userSpaces[0]
  return redirect(`/space/${firstSpace.slug}`)
}
