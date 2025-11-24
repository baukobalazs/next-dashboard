import { Card } from "./Card";
import { fetchCardData } from "@/app/lib/data"; // server-only
import CardWrapperClient from "./CardWrapperClient";

export default async function CardWrapperServer() {
  const {
    numberOfCustomers,
    numberOfInvoices,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchCardData();

  return (
    <CardWrapperClient
      data={{
        numberOfCustomers,
        numberOfInvoices,
        totalPaidInvoices,
        totalPendingInvoices,
      }}
    />
  );
}
