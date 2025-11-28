import postgres from 'postgres';
import {
  Customer,
  CustomerField,
  CustomersTableType,
  Invoice,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
  UserField,
} from './definitions';
import { formatCurrency } from './utils';
import { notFound } from 'next/navigation';
import { MOCK_CUSTOMERS, MOCK_INVOICES, MOCK_REVENUE, MOCK_USERS } from './placeholder-data';




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







export async function fetchRevenue() {
  if (USE_MOCK || !sql) {
    return MOCK_REVENUE;
  }

  try {
    const data = await sql`
      SELECT 
        TO_CHAR(date, 'YYYY-MM') AS month,
        SUM(amount) AS revenue
      FROM invoices
      WHERE status = 'paid'
      GROUP BY TO_CHAR(date, 'YYYY-MM')
      ORDER BY TO_CHAR(date, 'YYYY-MM') ASC;
    `;

    console.log('Revenue data from DB:', data);

    if (data.length === 0) {
      return MOCK_REVENUE;
    }

    return data.map((row: any) => ({
      month: row.month, 
      revenue: Number(row.revenue) / 100,
    }));
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  if (USE_MOCK || !sql) {
    console.log('Using mock invoice data...');
    return MOCK_INVOICES.slice(0, 5).map((invoice) => ({
      id: invoice.id,
      name: invoice.name,
      email: invoice.email,
      image_url: invoice.image_url,
      amount: formatCurrency(invoice.amount),
    }));
  }

  try {
    const data = await sql<LatestInvoiceRaw[]>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.map((invoice: Invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));

    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
  
}

export async function fetchCardData() {
  if (USE_MOCK || !sql) {
    console.log('Using mock card data...');
    const totalPaid = MOCK_INVOICES
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.amount, 0);
    const totalPending = MOCK_INVOICES
      .filter(inv => inv.status === 'pending')
      .reduce((sum, inv) => sum + inv.amount, 0);
    
    return {
      numberOfCustomers: MOCK_CUSTOMERS.length,
      numberOfInvoices: MOCK_INVOICES.length,
      totalPaidInvoices: formatCurrency(totalPaid),
      totalPendingInvoices: formatCurrency(totalPending),
    };
  }

  try {
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0][0].count ?? '0');
    const numberOfCustomers = Number(data[1][0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2][0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2][0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
  id? : string,
  role?: string,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  if (USE_MOCK || !sql) {
    console.log('Using mock filtered invoices...');
    const lowerQuery = query.toLowerCase();
    
    const filtered = MOCK_INVOICES.filter((invoice) => 
      invoice.id.toLowerCase().includes(lowerQuery) ||
      invoice.name.toLowerCase().includes(lowerQuery) ||
      invoice.email.toLowerCase().includes(lowerQuery) 
    
    );
    if(role === 'admin'){
    return filtered.slice(offset, offset + ITEMS_PER_PAGE);
    } else{
      const userFiltered = filtered.filter((invoice) => invoice.customer_id === id);
      return userFiltered.slice(offset, offset + ITEMS_PER_PAGE);
    }
  }

  try {
     const whereClause = role !== 'admin' 
      ? sql`AND invoices.customer_id = ${id}` 
      : sql``;
    const invoices = await sql<InvoicesTable[]>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        COALESCE(invoices.deadline::text, '') as deadline,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        (invoices.id::text ILIKE ${`%${query}%`} OR
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`})
        ${whereClause}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices;
  } catch (error) {

    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string, id?:string, role?: string) {
  if (USE_MOCK || !sql) {
    console.log('Using mock invoice pages...');
    const lowerQuery = query.toLowerCase();
    
    const filtered = MOCK_INVOICES.filter((invoice) => 
      invoice.name.toLowerCase().includes(lowerQuery) ||
      invoice.email.toLowerCase().includes(lowerQuery) ||
      invoice.amount.toString().includes(lowerQuery) ||
      invoice.date.includes(query) ||
      invoice.status.toLowerCase().includes(lowerQuery)
    );
    if(role === 'admin'){
    return Math.ceil(filtered.length / ITEMS_PER_PAGE);
    } else {
      const userFiltered = filtered.filter((invoice) => invoice.customer_id === id);
      return Math.ceil(userFiltered.length / ITEMS_PER_PAGE);
    }
  }

  try {
      const whereClause = role !== 'admin' 
      ? sql`AND invoices.customer_id = ${id}` 
      : sql``;
    const data = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      (customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`})
      ${whereClause}
  `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  if (USE_MOCK || !sql) {
    console.log('Using mock invoice by id...');
    const invoice = MOCK_INVOICES.find(inv => inv.id === id);
    
    if (!invoice) {
      notFound();
    }
  
    return {
      id: invoice.id,
      customer_id: invoice.customer_id,
      amount: invoice.amount / 100, 
      status: invoice.status,
      deadline : invoice.deadline,
    };
  }

  try {
    const data = await sql<InvoiceForm[]>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status, 
        invoices.deadline
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.map((invoice: Invoice) => ({
      ...invoice,
      amount: invoice.amount / 100,
    }));
     if (!invoice) {
      notFound();
    }

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomerById(id: string) {
  if (USE_MOCK || !sql) {
    console.log('Using mock customer by id...');
    const customer = MOCK_CUSTOMERS.find(inv => inv.id === id);
    
    if (!customer) {
      notFound();
    
    }
  
    return {
      id: customer.id,
  name: customer.name,
  email: customer.email,
  image_url: customer.image_url,
  total_invoices: customer.total_invoices,
  total_pending: customer.total_pending,
  total_paid: customer.total_paid,
      
    };
  }

  try {
    const data = await sql<CustomersTableType[]>`
      SELECT
        customers.id,
        customers.name,
        customers.email,
        customers.image_url
      FROM customers
      WHERE customers.id = ${id};
    `;

    const customer = data.map((customer: CustomersTableType) => ({
      ...customer,
      
    }));
    if(!customer){
      notFound();
    }
    return customer[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch customer.');
  }
}

export async function fetchCustomers() {
  if (USE_MOCK || !sql) {
    console.log('Using mock customers...');
    return MOCK_CUSTOMERS.map(customer => ({
      id: customer.id,
      name: customer.name,
    }));
  }

  try {
    const customers = await sql<CustomerField[]>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(
  query: string,
  currentPage: number,
) {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  if (USE_MOCK || !sql) {
    console.log('Using mock filtered customers...');
    const lowerQuery = query.toLowerCase();
    
    const filtered = MOCK_CUSTOMERS.filter((customer) => 
      customer.name.toLowerCase().includes(lowerQuery) ||
      customer.email.toLowerCase().includes(lowerQuery)||
      customer.id.toLowerCase().includes(lowerQuery)
    );

   const  filteredSliced = filtered.slice(offset, offset + ITEMS_PER_PAGE);
    
    return filteredSliced.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));
  }

  try {
    const data = await sql<CustomersTableType[]>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
      customers.id::text ILIKE ${`%${query}%`} OR
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
    LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
	  `;

    const customers = data.map((customer: CustomersTableType) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function fetchCustomersPages(query: string) {
  if (USE_MOCK || !sql) {
    console.log('Using mock customers pages...');
    const lowerQuery = query.toLowerCase();
    
    const filtered = MOCK_CUSTOMERS.filter((customer) => 
      customer.name.toLowerCase().includes(lowerQuery) ||
      customer.email.toLowerCase().includes(lowerQuery) 
       
    );

    return Math.ceil(filtered.length / ITEMS_PER_PAGE);
  }

  try {
    const data = await sql`SELECT COUNT(*)
    FROM customers
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} 
  `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of customers.');
  }
}

export async function fetchUsers() {
  if (USE_MOCK || !sql) {
    console.log('Using mock users...');
    return MOCK_USERS .map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
    }));
  }

  try {
    const users = await sql<UserField[]>`
      SELECT
        id,
        name,
        email
      FROM users
      ORDER BY name ASC
    `;

    return users;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all users.');
  }
}