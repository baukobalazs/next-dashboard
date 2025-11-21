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



const MOCK_REVENUE: Revenue[] = [
  { month: 'Jan', revenue: 2000 },
  { month: 'Feb', revenue: 1800 },
  { month: 'Mar', revenue: 2200 },
  { month: 'Apr', revenue: 2500 },
  { month: 'May', revenue: 2300 },
  { month: 'Jun', revenue: 3200 },
  { month: 'Jul', revenue: 3500 },
  { month: 'Aug', revenue: 3700 },
  { month: 'Sep', revenue: 2500 },
  { month: 'Oct', revenue: 2800 },
  { month: 'Nov', revenue: 3000 },
  { month: 'Dec', revenue: 4800 },
];

const MOCK_INVOICES: InvoicesTable[] = [
  {
    id: '1',
    customer_id: 'cust1',
    name: 'Evil Rabbit',
    email: 'evil@rabbit.com',
    image_url: '/customers/evil-rabbit.png',
    date: '2024-01-15',
    amount: 375000,
    status: 'pending',
  },
  {
    id: '2',
    customer_id: 'cust2',
    name: 'Delba de Oliveira',
    email: 'delba@oliveira.com',
    image_url: '/customers/delba-de-oliveira.png',
    date: '2024-01-10',
    amount: 250000,
    status: 'paid',
  },
  {
    id: '3',
    customer_id: 'cust3',
    name: 'Lee Robinson',
    email: 'lee@robinson.com',
    image_url: '/customers/lee-robinson.png',
    date: '2024-01-08',
    amount: 125000,
    status: 'paid',
  },
  {
    id: '4',
    customer_id: 'cust4',
    name: 'Michael Novotny',
    email: 'michael@novotny.com',
    image_url: '/customers/michael-novotny.png',
    date: '2024-01-05',
    amount: 854600,
    status: 'pending',
  },
  {
    id: '5',
    customer_id: 'cust5',
    name: 'Amy Burns',
    email: 'amy@burns.com',
    image_url: '/customers/amy-burns.png',
    date: '2024-01-03',
    amount: 650000,
    status: 'paid',
  },
  {
    id: '6',
    customer_id: 'cust1',
    name: 'Evil Rabbit',
    email: 'evil@rabbit.com',
    image_url: '/customers/evil-rabbit.png',
    date: '2023-12-20',
    amount: 120000,
    status: 'paid',
  },
  {
    id: '7',
    customer_id: 'cust2',
    name: 'Delba de Oliveira',
    email: 'delba@oliveira.com',
    image_url: '/customers/delba-de-oliveira.png',
    date: '2023-12-15',
    amount: 340000,
    status: 'pending',
  },
];

const MOCK_CUSTOMERS: CustomersTableType[] = [
  {
    id: 'cust1',
    name: 'Evil Rabbit',
    email: 'evil@rabbit.com',
    image_url: '/customers/evil-rabbit.png',
    total_invoices: 2,
    total_pending: 375000,
    total_paid: 120000,
  },
  {
    id: 'cust2',
    name: 'Delba de Oliveira',
    email: 'delba@oliveira.com',
    image_url: '/customers/delba-de-oliveira.png',
    total_invoices: 2,
    total_pending: 340000,
    total_paid: 250000,
  },
  {
    id: 'cust3',
    name: 'Lee Robinson',
    email: 'lee@robinson.com',
    image_url: '/customers/lee-robinson.png',
    total_invoices: 1,
    total_pending: 0,
    total_paid: 125000,
  },
  {
    id: 'cust4',
    name: 'Michael Novotny',
    email: 'michael@novotny.com',
    image_url: '/customers/michael-novotny.png',
    total_invoices: 1,
    total_pending: 854600,
    total_paid: 0,
  },
  {
    id: 'cust5',
    name: 'Amy Burns',
    email: 'amy@burns.com',
    image_url: '/customers/amy-burns.png',
    total_invoices: 1,
    total_pending: 0,
    total_paid: 650000,
  },
];

const MOCK_USERS: UserField[] = [
  {
    id: 'user1',
    name: 'qwe',
    email: 'qwe@qwe.com'
 
  },
]

export async function fetchRevenue() {
  if (USE_MOCK || !sql) {
    return MOCK_REVENUE;
  }

  try {
    const data = await sql`
      SELECT 
        DATE_TRUNC('month', date) AS month,
        SUM(amount) AS revenue
      FROM invoices
      WHERE status = 'paid'
      GROUP BY month
      ORDER BY month;
    `;

    return data.map((row: any) => ({
      month: row.month.toISOString().slice(0, 7), // pl. "2025-01"
      revenue: Number(row.revenue),
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
    
    return filtered.slice(offset, offset + ITEMS_PER_PAGE);
  }

  try {
    const invoices = await sql<InvoicesTable[]>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        invoices.id::text ILIKE ${`%${query}%`} OR
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices;
  } catch (error) {

    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
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
    
    return Math.ceil(filtered.length / ITEMS_PER_PAGE);
  }

  try {
    const data = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
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
    };
  }

  try {
    const data = await sql<InvoiceForm[]>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
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
    return MOCK_USERS.map(user => ({
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