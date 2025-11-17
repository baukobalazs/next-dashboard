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

export async function createSession(id: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  let sessionId: string;
 
  if (USE_MOCK) {

    sessionId = `mock-${Math.floor(Math.random() * 1000000)}`;
  } else {
 
    const result = await sql`
      INSERT INTO sessions (user_id, expires_at)
      VALUES (${id}, ${expiresAt})
      RETURNING id
    `;
    sessionId = result[0].id;
  }

 
  const session = await encrypt({ sessionId, userId: id, expiresAt });
 
  const cookieStore = await cookies();
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}


async function encrypt(payload: { sessionId: string; userId: string; expiresAt: Date }) {

  return Buffer.from(JSON.stringify(payload)).toString('base64');
}


export async function decrypt(cookie: string | undefined) {
  if (!cookie) return null;

  try {

    const payload = JSON.parse(Buffer.from(cookie, 'base64').toString('utf-8'));
    

    if (new Date(payload.expiresAt) < new Date()) {
      return null;
    }

    if (USE_MOCK) {
      return { userId: payload.userId, sessionId: payload.sessionId };
    }


    const result = await sql`
      SELECT * FROM sessions 
      WHERE id = ${payload.sessionId} 
      AND expires_at > NOW()
    `;

    if (result.length === 0) {
      return null;
    }

    return { userId: result[0].user_id, sessionId: result[0].id };
  } catch (error) {
    console.error('Decrypt error:', error);
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get('session')?.value;
  
  if (cookie && !USE_MOCK) {
    try {
      const payload = JSON.parse(Buffer.from(cookie, 'base64').toString('utf-8'));
      
   
      await sql`
        DELETE FROM sessions WHERE id = ${payload.sessionId}
      `;
    } catch (error) {
      console.error('Error deleting session from database:', error);
    }
  }


  try {
    cookieStore.delete('session');
  } catch (error) {
    console.error(`Error deleting cookie: ${error}`);
  }
}