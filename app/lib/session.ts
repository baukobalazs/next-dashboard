import {cookies} from 'next/headers'
import postgres from 'postgres';
import bcrypt from 'bcryptjs'
 
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

export async function createSession(id: number) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
 
  // 1. Create a session in the database
  if (USE_MOCK) {
    // Mock implementation
    const sessionId = Math.floor(Math.random() * 1000000);
    const session = await encrypt({ sessionId, expiresAt });
    
    const cookieStore = await cookies();
    cookieStore.set('session', session, {
      httpOnly: true,
      secure: true,
      expires: expiresAt,
      sameSite: 'lax',
      path: '/',
    });
    
    return;
  }


  const result = await sql`
    INSERT INTO sessions (user_id, expires_at)
    VALUES (${id}, ${expiresAt})
    RETURNING id
  `;
 
  const sessionId = result[0].id;
 

  const session = await encrypt({ sessionId, expiresAt });
 

  const cookieStore = await cookies();
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}


async function encrypt(payload: { sessionId: number; expiresAt: Date }) {


  return JSON.stringify(payload); 
}