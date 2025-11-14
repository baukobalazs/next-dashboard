import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import {
  fetchCustomerById,
  fetchCustomers,
  fetchInvoiceById,
} from "@/app/lib/data";
import { notFound } from "next/navigation";
import EditInvoiceForm from "@/app/ui/invoices/edit-form";
import EditCustomerForm from "@/app/ui/customers/edit-form";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const [customer, customers] = await Promise.all([
    fetchCustomerById(id),
    fetchCustomers(),
  ]);

  if (!customer) {
    notFound();
  }
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Customers", href: "/dashboard/Customers" },
          {
            label: "Edit Customers",
            href: `/dashboard/Customers/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditCustomerForm customer={customer} />
    </main>
  );
}
