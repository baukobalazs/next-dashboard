import { fetchFilteredInvoices } from "@/app/lib/data";
import { auth } from "@/auth";
import React from "react";
import InvoicesTableClient from "./InvoicesTableClient";

const InvoicesTableServer = async ({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) => {
  const session = await auth();
  const invoices = await fetchFilteredInvoices(
    query,
    currentPage,
    session?.user.id,
    session?.user.role
  );
  return <InvoicesTableClient session={session} invoices={invoices} />;
};

export default InvoicesTableServer;
