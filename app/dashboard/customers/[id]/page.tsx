import { fetchCustomerById, fetchInvoiceById } from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import SingleCustomerForm from "@/app/ui/single-customer-form";
import SingleInvoiceForm from "@/app/ui/single-invoice-form";
import { notFound } from "next/navigation";
import React from "react";

const Page = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  const id = params.id;
  const customer = await fetchCustomerById(id);

  if (!customer.id) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Customer", href: "/dashboard/customers" },
          {
            label: `Customer ${id}`,
            href: `/dashboard/customers/${id}`,
            active: true,
          },
        ]}
      />
      <SingleCustomerForm customer={customer} />
    </main>
  );
};

export default Page;
