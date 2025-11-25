import { fetchFilteredCustomers, fetchFilteredInvoices } from "@/app/lib/data";
import { auth } from "@/auth";
import React from "react";
import CustomersTableClient from "./CustomersTableClient";

const CustomersTableServer = async ({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) => {
  const session = await auth();
  const customers = await fetchFilteredCustomers(query, currentPage);
  return <CustomersTableClient session={session} customers={customers} />;
};

export default CustomersTableServer;
