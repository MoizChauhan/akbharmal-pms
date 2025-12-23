import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
    ],
    callbacks: {
        async session({ session, user }) {
            const dbUser = await prisma.user.findUnique({
                where: { id: user.id },
            });
            if (dbUser) {
                (session.user as any).activeModules = dbUser.activeModules;
            }
            return session;
        },
    },
});
