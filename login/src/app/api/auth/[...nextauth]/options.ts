import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import mysql from "mysql2/promise";
import { CustomUser } from "@/types/customTypes";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/login",
  },

  callbacks: {
    async signIn({ user, account, credentials }) {
      const connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST!,
        user: process.env.MYSQL_USER!,
        password: process.env.MYSQL_PASSWORD!,
        database: process.env.MYSQL_DATABASE!,
      });

      try {
        let wardNumber = credentials?.wardNumber;

        // If using OAuth (Google/GitHub), get wardNumber from the query string
        if (account?.provider === "google" || account?.provider === "github") {
          wardNumber = (account as any).params?.wardNumber;
        }

        if (wardNumber) {
          // Check if the user already exists
          const [userRows] = await connection.execute(
            'SELECT * FROM User WHERE email = ?',
            [user.email]
          );

          if ((userRows as any[]).length > 0) {
            return true;
          }

          // Create a new user with wardNumber if not found
          await connection.execute(
            'INSERT INTO User (email, role, ward_number) VALUES (?, ?, ?)',
            [user.email, 'User', wardNumber]
          );

          return true;
        }

        // Check if the user already exists in Admin table
        const [adminRows] = await connection.execute(
          'SELECT * FROM Admin WHERE email = ?',
          [user.email]
        );

        if ((adminRows as any[]).length > 0) {
          return true;
        }

        // Create a new user if not found in either table
        await connection.execute(
          'INSERT INTO User (email) VALUES (?)',
          [user.email]
        );

        return true;
      } catch (error) {
        console.log("The error is ", error);
        return false;
      } finally {
        await connection.end();
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.user = user as CustomUser;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = token.user as CustomUser;
      return session;
    },
  },

  providers: [
    Credentials({
      name: "Welcome Back",
      type: "credentials",

      credentials: {
        wardNumber: {
          label: "Ward Number",
          type: "number"
        },
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email"
        },
        password: {
          label: "Password",
          type: "password"
        }
      },

      async authorize(credentials) {
        const connection = await mysql.createConnection({
          host: process.env.MYSQL_HOST!,
          user: process.env.MYSQL_USER!,
          password: process.env.MYSQL_PASSWORD!,
          database: process.env.MYSQL_DATABASE!,
        });

        try {
          // Check if the user exists in User table
          const [userRows] = await connection.execute(
            'SELECT * FROM User WHERE email = ?',
            [credentials?.email]
          );

          const user = (userRows as any[])[0];

          if (user && bcrypt.compareSync(credentials?.password!, user.password)) {
            return user;
          }

          // Check if the user exists in Admin table
          const [adminRows] = await connection.execute(
            'SELECT * FROM Admin WHERE email = ?',
            [credentials?.email]
          );

          const admin = (adminRows as any[])[0];

          if (admin && admin.password === credentials?.password) {
            return admin;
          }

          return null;
        } catch (error) {
          console.log("Authorization error: ", error);
          return null;
        } finally {
          await connection.end();
        }
      },
    }),

    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
};