
import postgres from "postgres";

const USE_MOCK = process.env.USE_MOCK_DATA === "true";

let sql: any;

if (!USE_MOCK && process.env.POSTGRES_URL) {
  sql = postgres(process.env.POSTGRES_URL, { ssl: "require" });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return new Response("Missing token", { status: 400 });
  }

  const rows = await sql`
    SELECT user_email FROM email_verification_tokens
    WHERE token = ${token}
  `;

  if (rows.length === 0) {
    return new Response("Invalid or expired token", { status: 400 });
  }

  const email = rows[0].user_email;

  await sql`
    UPDATE users
    SET is_verified = true
    WHERE email = ${email}
  `;

  await sql`
    DELETE FROM email_verification_tokens
    WHERE token = ${token}
  `;

  return Response.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/login`);
}
