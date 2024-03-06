import { redirect } from 'next/navigation'
import { getAuthenticatedUser } from '~/actions/auth'
import { createRandomSpace, getSpacesByUserIdentifier, validateInvite } from '~/actions/space'
import HomeUI from '~/components/Home'

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

export default async function Index(props: Props) {
  const { inviteToken } = props.searchParams

  const user = await getAuthenticatedUser()
  if (!user) return <HomeUI />

  if (inviteToken) await validateInvite(inviteToken)

  const space = await getSpace()

  return redirect(`/space/${space.slug}`)
}
