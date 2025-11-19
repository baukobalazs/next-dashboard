import { fetchCustomerById, fetchInvoiceById } from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import SingleInvoiceForm from "@/app/ui/single-invoice-form";
import { notFound } from "next/navigation";
import React from "react";

const Page = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  const id = params.id;
  const invoice = await fetchInvoiceById(id);

  if (!invoice.id) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Invoices", href: "/dashboard/invoices" },
          {
            label: `Invoice ${id}`,
            href: `/dashboard/invoices/${id}`,
            active: true,
          },
        ]}
      />
      <SingleInvoiceForm invoice={invoice} />
    </main>
  );
};

export default Page;
