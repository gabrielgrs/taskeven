import { redirect } from 'next/navigation'
import { getUserIdentifier } from '~/actions/auth'
import { createRandomSpace, getSpacesByUserIdentifier, validateInvite } from '~/actions/space'

async function getSpace() {
  const userSpaces = await getSpacesByUserIdentifier()

  if (userSpaces.length === 0) return createRandomSpace()

  // TODO: get last updated
  return userSpaces[0]
}

type Props = {
  searchParams: {
    inviteToken?: string
  }
}

export default async function Home(props: Props) {
  const { inviteToken } = props.searchParams

  const userIdentifier = await getUserIdentifier()

  if (!userIdentifier) throw Error('Unauthorized access')

  if (inviteToken) {
    await validateInvite(inviteToken)
  }

  const space = await getSpace()

  return redirect(`/space/${space.slug}`)
}
