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
        id: user.id,
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

      const { data: valid }: { data: boolean } = await axios.post(url, context, config)

      // if (valid && account) {
      //   const { access_token, id_token } = account
      //   const { data } = await axios.post(`${getServerUrl()}/api/discord/`, { access_token, id_token })
      // }

      return valid
    },
    async jwt({ token, user, account }) {
      if (account?.provider !== "credentials") {
        // token.access = account.access_token
        // token.refresh = account.refresh_token
      }

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
