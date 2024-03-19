import { redirect } from 'next/navigation'
import { validateInvite } from '~/actions/space'

type Props = {
  searchParams: {
    inviteToken?: string
  }
}

export default async function Invite(props: Props) {
  const { inviteToken } = props.searchParams

  if (!inviteToken) return redirect('/')

  const invitedSpace = await validateInvite(inviteToken)
  return redirect(`/space/${invitedSpace.slug}`)
}
