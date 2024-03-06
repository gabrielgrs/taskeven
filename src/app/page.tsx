import { redirect } from 'next/navigation'
import { getUserIdentifier } from '~/actions/auth'
import { createRandomSpace, getSpacesByUserIdentifier } from '~/actions/space'

async function getSpace() {
  const userIdentifier = await getUserIdentifier()

  if (!userIdentifier) throw Error('Unauthorized access')

  const userSpaces = await getSpacesByUserIdentifier()

  if (userSpaces.length === 0) return createRandomSpace()

  // TODO: get last updated
  return userSpaces[0]
}

export default async function Spaces() {
  const space = await getSpace()

  return redirect(`/${space.slug}`)
}
