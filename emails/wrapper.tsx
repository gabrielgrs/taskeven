import * as React from 'react'
import { Body, Container, Head, Heading, Hr, Html, Img, Link, Preview, Tailwind, Text } from '@react-email/components'

export type WrapperProps = {
  baseUrl: string
  preview: string
  children: React.ReactNode
  title: React.ReactNode
}

function Footer({ baseUrl }: { baseUrl: string }) {
  return (
    <>
      <Hr className="my-8" />
      <Link href={baseUrl} target="_blank">
        Taskeven
      </Link>
      <br />
      <Text className="text-xs opacity-70"> If you didn{"'"}t request this, please just ignore this email!</Text>
    </>
  )
}

export default function Wrapper({ children, baseUrl, preview, title }: WrapperProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Tailwind>
        <Body className="bg-white font-sans p-4">
          <Container>
            <Img
              src="https://taskeven.vercel.app/_next/image?url=%2Ficons%2Flogo.png&w=96&q=75"
              width="42"
              height="42"
              alt="Taskeven"
            />
            <Heading className="font-thin">{title}</Heading>

            {children}

            <Footer baseUrl={baseUrl} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

Wrapper.PreviewProps = {
  baseUrl: 'http://localhost:3000',
  preview: 'Your magic link for Taskeven',
  title: (
    <>
      Your magic link to <strong>Taskeven</strong>
    </>
  ),
} as WrapperProps
