import Form from "@/app/ui/invoices/create-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { fetchCustomers, fetchUsers } from "@/app/lib/data";
import CustomerCreateForm from "@/app/ui/customers/create-form";

export default async function Page() {
  const users = await fetchUsers();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Create Customer", href: "/dashboard/customers" },
          {
            label: "Customer has to be a registered user",
            href: "/dashboard/customers/create",
            active: true,
          },
        ]}
      />
      <CustomerCreateForm users={users} />
    </main>
  );
}
