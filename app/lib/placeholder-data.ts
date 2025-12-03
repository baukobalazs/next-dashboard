import { Revenue, InvoicesTable, CustomersTableType, CreditCard, Article, Tag } from "./definitions";

const MOCK_USERS = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'Test User',
    email: 'qwe@asd.com',
    password: 'qwe123', 
    role: 'admin',
    is_verified: true,
    image_url: '/customers/evil-rabbit.png',
    
  },
    {
    id: '230564b2-4001-4271-9855-fec4b6a6432c',
    name: 'asd',
    email: 'asd@asd.com',
    password: 'qwe123', 
    role: 'user',
    is_verified: true,
    image_url: '/customers/delba-de-oliveira.png',
  },
];

const MOCK_CUSTOMERS: CustomersTableType[] = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'Evil Rabbit',
    email: 'evil@rabbit.com',
    image_url: '/customers/evil-rabbit.png',
    total_invoices: 2,
    total_pending: 375000,
    total_paid: 120000,
  },
  {
    id: '230564b2-4001-4271-9855-fec4b6a6432c',
    name: 'Delba de Oliveira',
    email: 'delba@oliveira.com',
    image_url: '/customers/delba-de-oliveira.png',
    total_invoices: 2,
    total_pending: 340000,
    total_paid: 250000,
  },
];

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
    customer_id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'Evil Rabbit',
    email: 'evil@rabbit.com',
    image_url: '/customers/evil-rabbit.png',
    date: '2024-01-15',
    amount: 375000,
    status: 'pending',
    deadline: '2025-12-25'
  },
  {
    id: '2',
    customer_id: '230564b2-4001-4271-9855-fec4b6a6432c',
    name: 'Delba de Oliveira',
    email: 'delba@oliveira.com',
    image_url: '/customers/delba-de-oliveira.png',
    date: '2024-01-10',
    amount: 250000,
    status: 'paid',
    deadline: null
  },
  {
    id: '3',
    customer_id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'Evil Rabbit',
    email: 'evil@rabbit.com',
    image_url: '/customers/evil-rabbit.png',
    date: '2024-01-08',
    amount: 125000,
    status: 'paid',
    deadline: null
  },
  {
    id: '4',
    customer_id: '230564b2-4001-4271-9855-fec4b6a6432c',
    name: 'Delba de Oliveira',
    email: 'delba@oliveira.com',
    image_url: '/customers/delba-de-oliveira.png',
    date: '2024-01-05',
    amount: 854600,
    status: 'pending',
     deadline: '2025-12-31'
  },
  {
    id: '5',
    customer_id: '410544b2-4001-4271-9855-fec4b6a6442a',
     name: 'Evil Rabbit',
    email: 'evil@rabbit.com',
    image_url: '/customers/evil-rabbit.png',
    date: '2024-01-03',
    amount: 650000,
    status: 'paid',
    deadline: null
  },
  {
    id: '6',
    customer_id: '230564b2-4001-4271-9855-fec4b6a6432c',
    name: 'Delba de Oliveira',
    email: 'delba@oliveira.com',
    image_url: '/customers/delba-de-oliveira.png',
    date: '2023-12-20',
    amount: 120000,
    status: 'paid',
    deadline: null
  },
  {
    id: '7',
    customer_id: '410544b2-4001-4271-9855-fec4b6a6442a',
     name: 'Evil Rabbit',
    email: 'evil@rabbit.com',
    image_url: '/customers/evil-rabbit.png',
    date: '2023-12-15',
    amount: 340000,
    status: 'pending',
     deadline: '2025-12-31'
  },
   {
    id: '8',
    customer_id: '230564b2-4001-4271-9855-fec4b6a6432c',
    name: 'Delba de Oliveira',
    email: 'delba@oliveira.com',
    image_url: '/customers/delba-de-oliveira.png',
    date: '2023-12-15',
    amount: 340000,
    status: 'pending',
     deadline: '2025-12-31'
  },
    {
    id: '9',
    customer_id: '230564b2-4001-4271-9855-fec4b6a6432c',
    name: 'Delba de Oliveira',
    email: 'delba@oliveira.com',
    image_url: '/customers/delba-de-oliveira.png',
    date: '2023-12-15',
    amount: 3402300,
    status: 'paid',
     deadline: '2025-12-31'
  },
];

export const MOCK_CREDIT_CARDS: CreditCard[] = [
  {
    id: '1',
    user_id: '410544b2-4001-4271-9855-fec4b6a6442a', 
    card_holder_name: 'John Doe',
    card_number_last4: '4242',
    card_brand: 'Visa',
    expiry_month: '12',
    expiry_year: '2025',
    is_default: true,
    created_at: '2024-01-15',
  },
  {
    id: '2',
    user_id: '230564b2-4001-4271-9855-fec4b6a6432c',
    card_holder_name: 'Peter Parker',
    card_number_last4: '5555',
    card_brand: 'Mastercard',
    expiry_month: '08',
    expiry_year: '2026',
    is_default: false,
    created_at: '2024-02-20',
  },

  {
    id: '3',
    user_id: '410544b2-4001-4271-9855-fec4b6a6442a', 
    card_holder_name: 'John Doe',
    card_number_last4: '2342',
    card_brand: 'Mastercard',
    expiry_month: '11',
    expiry_year: '2026',
    is_default: false,
    created_at: '2024-03-15',
  },
];


export { MOCK_CUSTOMERS, MOCK_USERS, MOCK_REVENUE, MOCK_INVOICES };


export const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'How to Detect Fraud Patterns in Recurring Invoices',
    content:
      '<p>Identifying anomalies in recurring invoices is essential for finance teams. Modern analytics tools can highlight unusual patterns, duplicated payments, or sudden amount changes that may indicate fraud...</p>',
    excerpt:
      'Learn how finance teams detect unusual patterns in recurring invoices using modern analytics tools.',
    author_id: '410544b2-4001-4271-9855-fec4b6a6442a',
    author_name: 'John Doe',
    cover_image_url: 'https://example.com/invoice-fraud.jpg',
    status: 'published',
    is_public: true,
    published_at: '2025-03-15T10:00:00Z',
    created_at: '2025-03-15T10:00:00Z',
    updated_at: '2025-03-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Improving Revenue Forecasting with Data-Driven Models',
    content:
      '<p>Accurate revenue forecasting is crucial for long-term planning. Data-driven models help organizations predict cash flow, seasonal fluctuations, and customer churn more precisely...</p>',
    excerpt:
      'Discover how modern data-driven models enhance revenue forecasting accuracy for SaaS and service businesses.',
    author_id: '410544b2-4001-4271-9855-fec4b6a6442a',
    author_name: 'John Doe',
    cover_image_url: 'https://example.com/revenue-forecast.jpg',
    status: 'published',
    is_public: true,
    published_at: '2025-03-10T10:00:00Z',
    created_at: '2025-03-10T10:00:00Z',
    updated_at: '2025-03-10T10:00:00Z',
  },
];


export const MOCK_TAGS: Tag[] = [
  { id: '1', name: 'Finance', slug: 'finance' },
  { id: '2', name: 'Invoices', slug: 'invoices' },
  { id: '3', name: 'Analytics', slug: 'analytics' },
  { id: '4', name: 'Revenue', slug: 'revenue' },
  { id: '5', name: 'Data Insights', slug: 'data-insights' },
  { id: '6', name: 'Business Strategy', slug: 'business-strategy' },
];


