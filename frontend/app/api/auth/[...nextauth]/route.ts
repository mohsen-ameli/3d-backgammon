import NextAuth, { AuthOptions } from "next-auth"
import DiscordProvider from "next-auth/providers/discord"
import CredentialsProvider from "next-auth/providers/credentials"
import axios from "axios"
import getServerUrl from "@/components/utils/getServerUrl"
import jwtDecode from "jwt-decode"
import { TokenType, UserType } from "@/types/User.type"

const discordProvider = DiscordProvider({
  clientId: process.env.DISCORD_CLIENT_ID!,
  clientSecret: process.env.DISCORD_CLIENT_SECRET!,
  token: "https://discord.com/api/oauth2/token",
  userinfo: "https://discord.com/api/users/@me",
  authorization: {
    params: {
      scope: "identify email guilds applications.commands.permissions.update",
    },
  },
})

const credentialsProvider = CredentialsProvider({
  name: "Credentials",
  credentials: {},
  async authorize(credentials, req) {
    const { username, password } = credentials as {
      username: string
      password: string
    }

    // Add logic here to look up the user from the credentials supplied
    const { data }: { data: TokenType } = await axios.post(`${getServerUrl()}/api/token/`, {
      username,
      password,
    })

    const user: UserType = jwtDecode(data.access)
    user.token = data

    if (user) {
      return user
    } else {
      return null
    }
  },
})

export const authOptions: AuthOptions = {
  providers: [discordProvider, credentialsProvider],
  pages: { signIn: "/signin", error: "/signin" },
  callbacks: {
    async signIn({ user, account }) {
      // Call the backend to see if the user exists.
      // If it does, then just sign them in, and return true.
      // If not, then sign them up, and return true.
      if (account?.provider === "credentials") {
        return true
      }

      const context = {
        name: user.name,
        email: user.email,
        image: user.image,
        provider: account?.provider,
      }

      const config = user.image
        ? {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        : {}

      const url = `${getServerUrl()}/api/sign-in-up-provider/`

      const { data }: { data: { valid: boolean; id: number } } = await axios.post(url, context, config)

      user.id = data.id.toString()

      return data.valid
    },
    async jwt({ token, user, account }) {
      return { ...token, ...user, provider: account?.provider }
    },
    async session({ session, token }) {
      session.user = token as any
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
