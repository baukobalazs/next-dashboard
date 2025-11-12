import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import {z} from 'zod';
import type { User } from './app/lib/definitions';
import bcrypt from 'bcryptjs';
import postgres from 'postgres';


const USE_MOCK = process.env.USE_MOCK_DATA === 'true';

let sql: any;


if ((!USE_MOCK ) && process.env.POSTGRES_URL) {
  try {
    sql = postgres(process.env.POSTGRES_URL, { ssl: 'require' });
    console.log('Database connection established');
  } catch (error) {
    console.error('Failed to connect to database:', error);
  
    
  }
} else{
    console.log('Using mock data in development');
  }

  async function getUser(email: string) : Promise <User | undefined> {
    try {
        const user = await sql<User[]>`SELECT * FROM users WHERE email = ${email}`;
        return user[0];
    } catch (error) {
        console.error('Failed to fetch user: ', error);
        throw new Error('Failed to fetch user');
    }
  }

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials){
        const parsedCredentials = z
          .object({email: z.string().email(), password : z.string().min(6)})
          .safeParse(credentials);
        
        if(parsedCredentials.success){
          const {email, password} = parsedCredentials.data;
          const user = await getUser(email);
          if(!user) return null;
     
          const passwordMatch = await bcrypt.compare(password, user.password);
          if(passwordMatch) return user;
        }
        console.error("Invalid Credentials");
        return null;
      },
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Engedélyezzük a bejelentkezést
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Ha relatív URL, akkor baseUrl + url
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Ha ugyanazon az URL-en belül van, visszaadjuk
      else if (new URL(url).origin === baseUrl) return url;
      // Egyébként a dashboard-ra irányítunk
      return `${baseUrl}/dashboard`;
    },
  },
});