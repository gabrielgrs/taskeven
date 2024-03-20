import { Link, Section, Text } from '@react-email/components'
import { APP_NAME } from '~/utils/constants'
import Wrapper, { WrapperProps } from './wrapper'

type Props = Pick<WrapperProps, 'baseUrl'> & {
  token: string
}

export default function AuthEmail({ baseUrl, token }: Props) {
  return (
    <Wrapper
      baseUrl={baseUrl}
      preview={`Your magic link for ${APP_NAME}`}
      title={
        <>
          Your magic link to <strong>{APP_NAME}</strong>
        </>
      }
    >
      <Section>
        <Text>
          You are just one click away from accessing {APP_NAME}. Use the magic link below to log in instantly:
        </Text>
      </Section>
      <Section>
        <Link href={`${baseUrl}/auth?token=${token}`} className="text-black underline font-semibold">
          Click here to sign
        </Link>
      </Section>
      <Section>{/* <code className="text-lg bg-black text-white px-2 py-2 rounded">123456</code> */}</Section>
    </Wrapper>
  )
}
