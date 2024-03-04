import { Link, Section, Text } from '@react-email/components'
import Wrapper, { WrapperProps } from './wrapper'

type Props = Pick<WrapperProps, 'baseUrl'> & {
  token: string
  verificationCode: string
}

export default function AuthEmail({ baseUrl, token, verificationCode }: Props) {
  return (
    <Wrapper
      baseUrl={baseUrl}
      preview="Your magic link for Taskeven"
      title={
        <>
          Your magic link to <strong>Taskeven</strong>
        </>
      }
    >
      <Section>
        <Text>You are just one click away from accessing Taskeven. Use the magic link below to log in instantly:</Text>
      </Section>
      <Section>
        <Link href={`${baseUrl}/auth?token=${token}`} className="text-black underline font-semibold">
          Click here to sign
        </Link>
      </Section>
      <Section className="mt-8">
        <Text>Or use the code below</Text>
        <Text className="text-2xl bg-slate-200 w-max px-2 py-1 rounded font-semibold">{verificationCode}</Text>
      </Section>
      <Section>{/* <code className="text-lg bg-black text-white px-2 py-2 rounded">123456</code> */}</Section>
    </Wrapper>
  )
}
