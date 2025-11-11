'use server'
import {z} from 'zod'
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const USE_MOCK = process.env.USE_MOCK_DATA === 'true';

let sql : any ;

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


const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
})

const CreateInvoice = FormSchema.omit({id: true, date: true});
export async function createInvoice(formdata: FormData){
    const {customerId, amount, status} = CreateInvoice.parse({
        customerId: formdata.get('customerId'),
        amount: formdata.get('amount'),
        status: formdata.get('status'),
    })

    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];
    console.log('typeof data: ', typeof amount);
    console.log('formdataraw ', formdata);

    if(!USE_MOCK){
    await sql `
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
    }
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}


    const UpdateInvoice = FormSchema.omit({id: true, date: true});
    export async function updateInvoice(id: string,formdata : FormData){
      const {customerId, amount,status } = UpdateInvoice.parse({
      customerId: formdata.get('customerId'),
      amount: formdata.get('amount'),
      status: formdata.get('status'),
    })

    const amountInCents = amount * 100;

    if(!USE_MOCK){
    await sql `
      UPDATE invoices 
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHHERE id = ${id}
    `;
    }
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
    
  }