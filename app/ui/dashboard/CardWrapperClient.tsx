"use client";

import { Card } from "./Card";

type CardData = {
  numberOfCustomers: number;
  numberOfInvoices: number;
  totalPaidInvoices: string;
  totalPendingInvoices: string;
};

export default function CardWrapperClient({ data }: { data: CardData }) {
  return (
    <>
      <Card title="Collected" value={data.totalPaidInvoices} type="collected" />
      <Card title="Pending" value={data.totalPendingInvoices} type="pending" />
      <Card
        title="Total Invoices"
        value={data.numberOfInvoices}
        type="invoices"
      />
      <Card
        title="Total Customers"
        value={data.numberOfCustomers}
        type="customers"
      />
    </>
  );
}
