import { redirect } from 'next/navigation'
import { getSpacesByUserIdentifier } from '~/actions/space'

export default async function Spaces() {
  const spaces = await getSpacesByUserIdentifier()

  if (spaces.length === 0) return redirect('/space/form')
  return redirect(`/space/${spaces[0].slug}`)
}
