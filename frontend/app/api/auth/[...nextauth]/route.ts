import CredentialsProvider from "next-auth/providers/credentials"
import { login } from "@/lib/api/auth"

export const authOptions = {
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "E‑mail",
          type: "email",
          placeholder: "user@example.com",
        },
        password: { label: "Senha", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        try {
          const res = await login(credentials.email, credentials.password)

          return {
            id: res.user.id,
            name: res.user.name,
            email: res.user.email,
            accessToken: res.access_token,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.accessToken = user.accessToken
        token.id = user.id
      }
      return token
    },

    async session({ session, token }: any) {
      session.accessToken = token.accessToken as string
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },

  pages: {
    signIn: "/login",
    error: "/login?error",
  },

  debug: process.env.NODE_ENV !== "production",
}
