'use server'
import {z} from 'zod'
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth, signIn } from '@/auth';
import { AuthError } from 'next-auth';
import bcrypt, { compare } from 'bcryptjs';



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
    customerId: z.string({
      invalid_type_error: "Please select a customer",
    }),
    amount: z.coerce
    .number()
    .gt(0, {message: "Please enter an amount greater than 0$"}),
    status: z.enum(['pending', 'paid'], {
      invalid_type_error: "Please select an invoice status"
    }),
    date: z.string(),
})

const passwordSchema = z
  .string()
    .min(6, { message: 'Be at least 6 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .trim()

 const updatePasswordSchema = z
  .object({
    currentPassword: z.string(),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match!",
    path: ['confirmPassword'],
  });


  const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .trim(),
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: passwordSchema,
  confirmPassword: passwordSchema,
})

export type FormState =
  | {
      errors?: {
        name?: string[]
        email?: string[]
        password?: string[]
        confirmPassword? : string[],
      }
      message?: string
    }
  | undefined


 
export async function signup(state: FormState, formData: FormData) {

  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  })
 
  

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing fields. Failed to create User.",
    }
  }


   const passwordMatch = await bcrypt.compare(validatedFields.data.password, validatedFields.data.confirmPassword);
if(passwordMatch){
  const { name, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  if(!USE_MOCK){
  try {
     await sql`
    INSERT INTO users (name, email, password)
    VALUES (${name}, ${email}, ${hashedPassword})
  `
  } catch (error) {
    return {
      message: "Database error: Failed to create User"
    }
  }
  }
  revalidatePath('/login');
  redirect('/login');
}else console.error("Invalid Credentials");
}

export type State = {
  errors?: {
    customerId? : string[],
    amount? : string[], 
    status? : string[],
  };
  message?: string | null;
  
}

const CreateInvoice = FormSchema.omit({id: true, date: true});
export async function createInvoice(prevState : State,formdata: FormData){
    const validatedFields = CreateInvoice.safeParse({
        customerId: formdata.get('customerId'),
        amount: formdata.get('amount'),
        status: formdata.get('status'),
    })
    if(!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Missing fields. Failed to create invoice."
      }
    }
    const {customerId, amount, status} = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];
  
    if(!USE_MOCK){
      try {
         await sql `
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
      } catch (error) {
        return {
          message: "Database error: Failed to create Invoice"
        };
       
      }
   
    }
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}


    const UpdateInvoice = FormSchema.omit({id: true, date: true});
    export async function updateInvoice(id: string,prevState: State , formdata : FormData){
      const validatedFields = UpdateInvoice.safeParse({
      customerId: formdata.get('customerId'),
      amount: formdata.get('amount'),
      status: formdata.get('status'),
    })

    if(!validatedFields.success){
      return  {
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Missing fields. Failed to update invoice."
      }
    }
    const {customerId, amount, status} = validatedFields.data;
    const amountInCents = amount * 100;

    if(!USE_MOCK){
      try {
          await sql`
      UPDATE invoices 
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
      } catch (error) {
        return {
          message: "Database error: failed to Update Invoice"
        };
      }
  
    }
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
  }

  
  export async function deleteInvoice(id:string){
    if(!USE_MOCK) {
      await sql`
      DELETE FROM invoices WHERE id = ${id}
      `;
      revalidatePath('/dashboard/invoices')
    }
  }

  export async function authenticate(
    prevState : string | undefined,
    formData : FormData,
  ) {
    try {
      await signIn('credentials', formData);
    } catch (error) {
      if(error instanceof AuthError){
        switch (error.type){
          case 'CredentialsSignin': 
          return 'Invalid credentials.';
          default: 
            return 'Something went wrong.';
        }
      }
      throw error;
    }
  }

 
  

 