'use server'
import { z} from 'zod'
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import bcrypt from 'bcryptjs';
import { Resend } from "resend";
import crypto from "crypto";
import { put } from "@vercel/blob";

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



const passwordSchema = z
  .string()
    .min(6, { message: 'Be at least 6 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .trim()

  const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .trim(),
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: passwordSchema,
  confirmPassword: z.string(),
})
.refine((data) => data.password === data.confirmPassword, {
  message : "Passwords don't match!",
  path: ['confirmPassword'],
})

export type SignUpFormState =
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

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;

  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  return "http://localhost:3000";
}
const baseUrl = getBaseUrl();


export async function signup(state: SignUpFormState, formData: FormData) {

  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  })
 
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message:  "Validation failed",
    }
  }
  

  const { name, email, password } = validatedFields.data;

  if(!USE_MOCK){
  try {
    const existingUser  = await sql`
      SELECT id FROM users WHERE email = ${email}
    `
      if(existingUser.length > 0){
    return {
      errors: { email: ["This email is already registered"]},
      message: 'Email already exists',
    }
  }
    const hashedPassword = await bcrypt.hash(password, 10);
     await sql`
    INSERT INTO users (name, email, password, role, image_url)
    VALUES (${name}, ${email}, ${hashedPassword}, 'user' , '/customers/defaultProfile.png')
  `
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const resend = new Resend(process.env.RESEND_API_KEY);
  await sql`
  INSERT INTO email_verification_tokens (user_email, token)
  VALUES (${email}, ${verificationToken})
`;
const result = await resend.emails.send({
  from: "Acme <onboarding@resend.dev>",
  to: email,
  subject: "Verify your email",
  html: `
    <p>Hi ${name},</p>
    <p>Click the link below to verify your email:</p>
    <a href="${baseUrl}/verify?token=${verificationToken}">
    
      Verify Email
    </a>
  `,
});
if (result.error) {
  console.error("RESEND ERROR:", result.error);
}

  } catch (error) {
    console.log("Sign up error", error);
    return {
      message: "Database error: Failed to create User"
    }
  }
  }
  revalidatePath('/login');
  revalidatePath('/dashboard');
  redirect('/login');

}



export type InvoiceState = {
  errors?: {
    customerId? : string[],
    amount? : string[], 
    status? : string[],
    deadline?:  string[],
  };
  message?: string | null;
  
}

const InvoiceFormSchema = z.object({
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
    deadline: z.string().optional().nullable(),
})

const CreateInvoice = InvoiceFormSchema.omit({id: true, date: true});
export async function createInvoice(prevState : InvoiceState,formdata: FormData){
    const validatedFields = CreateInvoice.safeParse({
        customerId: formdata.get('customerId'),
        amount: formdata.get('amount'),
        status: formdata.get('status'),
        deadline: formdata.get('deadline') ||null,
    })
    if(!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Missing fields. Failed to create invoice."
      }
    }
    let {customerId, amount, status, deadline} = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];
    const finalDeadline = status === 'paid' ? null : deadline
    if(!USE_MOCK){
      if(status === 'paid'){
        deadline=null;
      }
      try {
         await sql `
    INSERT INTO invoices (customer_id, amount, status, date, deadline)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date}, ${finalDeadline})
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


    const UpdateInvoice = InvoiceFormSchema.omit({id: true, date: true});
    export async function updateInvoice(id: string,prevState: InvoiceState , formdata : FormData){
      const validatedFields = UpdateInvoice.safeParse({
      customerId: formdata.get('customerId'),
      amount: formdata.get('amount'),
      status: formdata.get('status'),
       deadline: formdata.get('deadline') || null,
    })

    if(!validatedFields.success){
      return  {
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Missing fields. Failed to update invoice."
      }
    }
    const {customerId, amount, status, deadline} = validatedFields.data;
    const amountInCents = amount * 100;
      const finalDeadline = status === 'paid' ? null : deadline
    if(!USE_MOCK){
      try {
          await sql`
      UPDATE invoices 
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}, deadline = ${finalDeadline}
      WHERE id = ${id}
    `;
      } catch (error) {
        return {
          message: "Database error: failed to Update Invoice"
        };
      }
  
    }
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
  }


   export type CustomerState = {
  errors?: {
    name? : string[], 
    email? : string[],
  };
  message?: string | null;
  
}


const CustomerFormSchema = z.object({
    id: z.string(),
    name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .trim(),
   email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
})


   const UpdateCustomer = CustomerFormSchema.omit({id: true});
    export async function updateCustomer(id: string,prevState: CustomerState , formdata : FormData){
      const validatedFields = UpdateCustomer.safeParse({
      name: formdata.get('name'),
      email: formdata.get('email'),
    })

    if(!validatedFields.success){
      return  {
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Missing fields. Failed to update customer."
      }
    }
    const {name, email} = validatedFields.data;
   
    if(!USE_MOCK){
      try {
      const existingUser = await sql `
      SELECT id FROM customers WHERE email = ${email}
      `
      if(existingUser.length > 0){
        return {
          errors: {email: ["This email already registered"]},
          message: 'Email already exists',
        }
      }
          await sql`
      UPDATE customers 
      SET  name = ${name}, email = ${email}
      WHERE id = ${id}
    `;
      } catch (error) {
        return {
          message: "Database error: failed to update customers"
        };
      }
  
    }
    revalidatePath('/dashboard', 'layout');
    redirect('/dashboard/customers');
  }
  
  export async function deleteInvoice(id:string){
    if(!USE_MOCK) {
      await sql`
      DELETE FROM invoices WHERE id = ${id}
      `;
      revalidatePath('/dashboard/invoices')
    }
  }

    export async function deleteCustomer(id:string){
    if(!USE_MOCK) {
      await sql`
      DELETE FROM customers WHERE id = ${id}
      `;
      revalidatePath('/dashboard/customers')
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
            return 'Email not verified.';
        }
      }
      throw error;
    }
  }

 
const CreateCustomer = CustomerFormSchema.omit({});
export async function createCustomer(prevState : CustomerState,formdata: FormData){
    const validatedFields = CreateCustomer.safeParse({
        id: formdata.get('id'),
        name: formdata.get('name'),
        email: formdata.get('email'),
    })
    if(!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Missing fields. Failed to create customer."
      }
    }
    const {id, name, email} = validatedFields.data;
  
    if(!USE_MOCK){
      try {
        const existingUser = await sql`
          SELECT id FROM customers WHERE email = ${email}
        `
        if(existingUser.length > 0){
          return {
            errors: {email : ["This email is already registered"]},
            message: "Email already exists",
          }
        }
         await sql `
    INSERT INTO customers (id, name, email, image_url)
    VALUES (${id}, ${name}, ${email}, '/customers/defaultProfile.png')
    `;
      } catch (error) {
        return {
          message: "Database error: Failed to create Customer"
        };
       
      }
   
    }
    revalidatePath('/dashboard', 'layout');
    redirect('/dashboard/customers');
}

export type UserProfileState = {
  errors?: {
    name?: string[];
    email?: string[];
    image?: string[];
  };
  message?: string | null;
};

export type PasswordState = {
  errors?: {
    currentPassword?: string[];
    newPassword?: string[];
    confirmPassword?: string[];
  };
  message?: string | null;
};

const UserProfileSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .trim(),
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
});

const PasswordSchema = z.object({
  currentPassword: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  newPassword: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  confirmPassword: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const UpdateUserProfile = UserProfileSchema.omit({ id: true });

export async function updateUserProfile(
  id: string,
  prevState: UserProfileState,
  formData: FormData
) {
  const validatedFields = UpdateUserProfile.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields. Failed to update profile.',
    };
  }

  const { name, email } = validatedFields.data;
  const imageFile = formData.get('image') as File | null;

  let imageUrl: string | null = null;


  if (imageFile && imageFile.size > 0) {
    try {
      const uniqueName =
        Date.now() + "-" + Math.round(Math.random() * 1e9) + "-" + imageFile.name;

      const blob = await put(uniqueName, imageFile, {
        access: "public",
      });

      imageUrl = blob.url;
    } catch (error) {
      console.error("Blob upload error:", error);
      return {
        errors: { image: ["Failed to upload image."] },
        message: "Image upload failed.",
      };
    }
  }

  if (!USE_MOCK) {
    try {
     
      const existingUser = await sql`
        SELECT id FROM users WHERE email = ${email} AND id != ${id}
      `;

      if (existingUser.length > 0) {
        return {
          errors: { email: ['This email is already registered.'] },
          message: 'Email already exists.',
        };
      }

    
      if (imageUrl) {
        await sql`
          UPDATE users 
          SET name = ${name}, email = ${email}, image_url = ${imageUrl}
          WHERE id = ${id}
        `;
      } else {
        await sql`
          UPDATE users 
          SET name = ${name}, email = ${email}
          WHERE id = ${id}
        `;
      }
    } catch (error) {
      return {
        message: 'Database error: failed to update profile.',
      };
    }
  }

  revalidatePath('/dashboard/profile');
  return { message: 'Profile updated successfully!' };
}

export async function updatePassword(
  userId: string,
  prevState: PasswordState,
  formData: FormData
) {
  const validatedFields = PasswordSchema.safeParse({
    currentPassword: formData.get('currentPassword'),
    newPassword: formData.get('newPassword'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid fields. Failed to update password.',
    };
  }

  const { currentPassword, newPassword } = validatedFields.data;

  if (!USE_MOCK) {
    try {
      
      const pw = await sql`
        SELECT password FROM users WHERE id = ${userId}
      `;

      if (!pw ) {
        return {
          message: 'User not found.',
        };
      }

      

      
      const passwordMatch = await bcrypt.compare(currentPassword, pw[0]);

      if (!passwordMatch) {
        return {
          errors: { currentPassword: ['Current password is incorrect.'] },
          message: 'Current password is incorrect.',
        };
      }

  
      const hashedPassword = await bcrypt.hash(newPassword, 10);

  
      await sql`
        UPDATE users 
        SET password = ${hashedPassword}
        WHERE id = ${userId}
      `;
    } catch (error) {
      return {
        message: 'Database error: failed to update password.',
      };
    }
  }

  revalidatePath('/dashboard/profile');
  return { message: 'Password updated successfully!' };
}