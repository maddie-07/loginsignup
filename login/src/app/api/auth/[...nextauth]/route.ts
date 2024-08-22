import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { authOptions } from "./options"

const handler = NextAuth(authOptions);

export { handler as GET , handler as POST};