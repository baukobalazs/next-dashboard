import LatestInvoicesClient from "./LatestInvoicesClient";
import { fetchLatestInvoices } from "@/app/lib/data";

export default async function LatestInvoicesServer() {
  const latestInvoices = await fetchLatestInvoices();
  return <LatestInvoicesClient latestInvoices={latestInvoices} />;
}
