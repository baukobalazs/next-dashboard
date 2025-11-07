import "dotenv/config";
import bcrypt from "bcryptjs";
import postgres from "postgres";
import { invoices, customers, revenue, users } from "app/lib/placeholder-data";

const sql = postgres(process.env.POSTGRES_URL_NON_POOLING!, { ssl: "require" });

async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;
  for (const user of users) {
    const hashed = await bcrypt.hash(user.password, 10);
    await sql`
      INSERT INTO users (id, name, email, password)
      VALUES (${user.id}, ${user.name}, ${user.email}, ${hashed})
      ON CONFLICT (id) DO NOTHING;
    `;
  }
}

async function seedCustomers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `;
  for (const c of customers) {
    await sql`
      INSERT INTO customers (id, name, email, image_url)
      VALUES (${c.id}, ${c.name}, ${c.email}, ${c.image_url})
      ON CONFLICT (id) DO NOTHING;
    `;
  }
}

async function seedInvoices() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;
  for (const i of invoices) {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${i.customer_id}, ${i.amount}, ${i.status}, ${i.date})
      ON CONFLICT (id) DO NOTHING;
    `;
  }
}

async function seedRevenue() {
  await sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;
  for (const r of revenue) {
    await sql`
      INSERT INTO revenue (month, revenue)
      VALUES (${r.month}, ${r.revenue})
      ON CONFLICT (month) DO NOTHING;
    `;
  }
}

async function main() {
  try {
    await seedUsers();
    await seedCustomers();
    await seedInvoices();
    await seedRevenue();
    console.log("✅ Database seeded successfully!");
  } catch (err) {
    console.error("❌ Error seeding database:", err);
  } finally {
    await sql.end();
  }
}

main();
