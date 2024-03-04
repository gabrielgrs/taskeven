import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { oAuthLogin } from '~/actions/auth'
import { setCookie } from '~/utils/storage'

type SignIn = {
  account: {
    provider: 'google'
  }
  profile: {
    email: string
    email_verified: boolean
    picture: string
    given_name: string
    family_name: string
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn(data) {
      const { account, profile } = data as unknown as SignIn

      if (account && profile) {
        if (account.provider === 'google' && profile.email_verified) {
          const token = await oAuthLogin(profile.email, {
            name: `${profile.given_name} ${profile.family_name}`.trim(),
            avatar: profile.picture,
          })

          setCookie('token', token)
        }
      }

      return true
    },
  },
})

export { handler as GET, handler as POST }
