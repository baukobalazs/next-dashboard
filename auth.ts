import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import type { User } from './app/lib/definitions';
import bcrypt from 'bcryptjs';
import postgres from 'postgres';
import { MOCK_USERS } from './app/lib/placeholder-data';

const USE_MOCK = process.env.USE_MOCK_DATA === 'true';

let sql: any;

if ((!USE_MOCK) && process.env.POSTGRES_URL) {
  try {
    sql = postgres(process.env.POSTGRES_URL, { ssl: 'require' });
    console.log('Database connection established');
  } catch (error) {
    console.error('Failed to connect to database:', error);
  }
} else {
  console.log('Using mock data in development');
}

export async function getUser(email: string): Promise<User | undefined> {
  try {
    if (USE_MOCK) {
      const user = MOCK_USERS.find(u => u.email === email);
      return user;
    }
    
    const user = await sql<User[]>`SELECT * FROM users WHERE email = ${email}`;
    return user[0];
  } catch (error) {
    console.error('Failed to fetch user: ', error);
    throw new Error('Failed to fetch user');
  }
}
export async function getUserByid(id: string): Promise<User | undefined> {
  try {
    if (USE_MOCK) {
      const user = MOCK_USERS.find(u => u.id === id);
      return user;
    }
    
    const user = await sql<User[]>`SELECT * FROM users WHERE id = ${id}`;
    return user[0];
  } catch (error) {
    console.error('Failed to fetch user: ', error);
    throw new Error('Failed to fetch user');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as User).role || 'user';
      }
      return token;
    
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
     
      }
      return session;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
        
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
       
          let passwordMatch = false;
          if (USE_MOCK) {
            passwordMatch = password === user.password;
          } else {
            passwordMatch = await bcrypt.compare(password, user.password);
          }
          if (!user.is_verified) {
         
            throw new Error("Email not verified");
            
          }
          if (passwordMatch) {
            return user; 
          }
        }
        
        console.error("Invalid Credentials");
        return null;
      },
    })
  ], 
});