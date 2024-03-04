import { Link, Section, Text } from '@react-email/components'
import Wrapper, { WrapperProps } from './wrapper'

type Props = Pick<WrapperProps, 'baseUrl'> & {
  listName: string
  listId: string
  token: string
}

export default function InviteEmail({ baseUrl, listName, token, listId }: Props) {
  return (
    <Wrapper
      baseUrl={baseUrl}
      preview="Invite to join Taskeven list"
      title={
        <>
          You are invited to join <i>{listName}</i> list from <strong>Taskeven</strong>
        </>
      }
    >
      <Section>
        <Text>You are just one click away from accessing Taskeven. Use the magic link below to log in instantly:</Text>
      </Section>
      <Section>
        <Link
          href={`${baseUrl}/invite?token=${token}&inviteId=${listId}`}
          className="text-black underline font-semibold"
        >
          Click here to accept invite
        </Link>
      </Section>
      <Section>{/* <code className="text-lg bg-black text-white px-2 py-2 rounded">123456</code> */}</Section>
    </Wrapper>
  )
}
