import { AuthOptions, ISODateString } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "@/lib/axios.config";
import { LOGIN_URL } from "@/lib/apiEndPoints";
import { JWT } from "next-auth/jwt";

export interface CustomSession {
  user?: CustomUser;
  expires: ISODateString;
}

export type CustomUser = {
  id?: string | null;
  username?: string | null;
  email?: string | null;
  email_verified_at?: string | null;
  profile_image?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  token?: string | null;
};

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session?.profile_image) {
        const user: CustomUser = token.user as CustomUser;
        user.profile_image = session?.profile_image;
      }

      if (user) {
        token.user = user;
      }
      return token;
    },

    async session({
      session,
      token,
      user,
    }: {
      session: CustomSession;
      token: JWT;
      user: CustomUser;
    }) {
      session.user = token.user as CustomUser;
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        const response = await axios.post(LOGIN_URL, credentials);
        const user = response.data.user;

        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
};
