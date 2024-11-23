
// app/api/auth/[...nextauth]/route.ts
import NextAuth, { User, Account } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { useDispatch } from "react-redux";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }: { user: User; account: Account | null }) {
      if (account?.provider === 'google') {
        try {
          

          return true

          // return `/api/auth/redirect?email=${user.email}&name=${user.name}&image=${user.image}`;
        } catch (error) {
          console.error('Sign-in error:', error);
          return false;
        }
      }
      return true;
    }
  },
  
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Define the NextAuth handler and export as GET and POST
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
