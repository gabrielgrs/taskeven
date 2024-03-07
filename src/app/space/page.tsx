import { redirect } from 'next/navigation'
import { createRandomSpace, getSpacesByUserIdentifier } from '~/actions/space'

async function getSpace() {
  const userSpaces = await getSpacesByUserIdentifier()
  if (userSpaces.length === 0) return createRandomSpace()
  return userSpaces[0] // TODO: get last updated
}

export default async function Page() {
  const space = await getSpace()
  return redirect(`/space/${space.slug}`)
}
