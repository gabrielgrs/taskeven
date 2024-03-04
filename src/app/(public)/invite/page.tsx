import { validateMemberInvite } from '~/actions/member'
import InviteTemplateUI from '~/components/Invite'

type Props = {
  searchParams: {
    token?: string
    inviteId?: string
  }
}

export default async function AuthPage(props: Props) {
  const { token, inviteId } = props.searchParams

  if (!token || !inviteId) throw Error('Token and invite are required')

  await validateMemberInvite(inviteId, token)

  return <InviteTemplateUI token={token} />
}
