import NextAuth from "next-auth"
import {prisma} from "@/lib/db"
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    })
  ],
  secret: process.env.NEXTAUTH_SECRET ?? "",
  callbacks: {
    async signIn({ user }) {
      if (!user.email) {
        return false;
      }
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });
  
      if (!existingUser) {
        await prisma.user.create({
          data: {
            email: user.email,
            provider: "Google",
          },
        });
      }
      return true;
    }
  }
})

export { handler as GET, handler as POST }