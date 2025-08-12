// import { NextAuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import FacebookProvider from "next-auth/providers/facebook";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import bcrypt from "bcryptjs";
//
// export const authOptions: NextAuthOptions = {
//     // Don't use PrismaAdapter since we're manually handling user creation
//     // adapter: PrismaAdapter(prisma),
//     session: {
//         strategy: "jwt",
//     },
//     providers: [
//         GoogleProvider({
//             clientId: process.env.GOOGLE_CLIENT_ID!,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//         }),
//         FacebookProvider({
//             clientId: process.env.FACEBOOK_CLIENT_ID!,
//             clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
//         }),
//         CredentialsProvider({
//             name: "credentials",
//             credentials: {
//                 email: { label: "Email", type: "email" },
//                 password: { label: "Password", type: "password" },
//             },
//             async authorize(credentials) {
//                 if (!credentials?.email || !credentials?.password) {
//                     return null;
//                 }
//
//                 const user = await prisma.user.findUnique({
//                     where: {
//                         email: credentials.email,
//                     },
//                 });
//
//                 if (!user || !user.password) {
//                     return null;
//                 }
//
//                 // Verify password
//                 const isPasswordValid = await bcrypt.compare(
//                     credentials.password,
//                     user.password
//                 );
//
//                 if (!isPasswordValid) {
//                     return null;
//                 }
//
//                 return {
//                     id: user.id,
//                     email: user.email,
//                     name: user.name,
//                     role: user.role,
//                 };
//             },
//         }),
//     ],
//     callbacks: {
//         async signIn({ user, account, profile }) {
//             // Allow credentials sign in
//             if (account?.provider === "credentials") {
//                 return true;
//             }
//
//             // Handle OAuth providers (Google, Facebook)
//             if (
//                 account?.provider === "google" ||
//                 account?.provider === "facebook"
//             ) {
//                 try {
//                     // Check if user already exists
//                     const existingUser = await prisma.user.findUnique({
//                         where: { email: user.email! },
//                     });
//
//                     if (!existingUser) {
//                         // Create new user for OAuth sign in
//                         await prisma.user.create({
//                             data: {
//                                 email: user.email!,
//                                 name: user.name || "",
//                                 image: user.image || "",
//                                 role: "CUSTOMER",
//                                 // OAuth users don't have passwords
//                                 password: null,
//                             },
//                         });
//                     }
//                     return true;
//                 } catch (error) {
//                     console.error("Error creating OAuth user:", error);
//                     return false;
//                 }
//             }
//
//             return true;
//         },
//         async jwt({ token, user, account }) {
//             if (user) {
//                 // For new sign-ins, get user data from database
//                 const dbUser = await prisma.user.findUnique({
//                     where: { email: user.email! },
//                 });
//
//                 if (dbUser) {
//                     token.id = dbUser.id;
//                     token.role = dbUser.role;
//                     token.email = dbUser.email;
//                     token.name = dbUser.name;
//                 }
//             }
//             return token;
//         },
//         async session({ session, token }) {
//             if (token && session.user) {
//                 session.user.id = token.id as string;
//                 session.user.role = token.role as string;
//                 session.user.email = token.email as string;
//                 session.user.name = token.name as string;
//             }
//             return session;
//         },
//     },
//     // Add custom pages
//     pages: {
//         signIn: "/auth/signin",
//     },
// };
//
// export default authOptions;
