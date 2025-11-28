// import { fetchFilteredInvoices } from "@/app/lib/data";
// import { fetchUserCreditCards } from "@/app/lib/actions";

// import { CreditCard, InvoicesTable } from "@/app/lib/definitions";
// import PendingInvoicesClient from "./pending-invoices-client";

// type PendingInvoicesProps = {
//     invoices: InvoicesTable[];
//   userId: string;
//   userRole: string;
//   cards: CreditCard[];
// };

// export default async function PendingInvoicesServer({
//   invoices,
//   userId,
//   userRole,
//   cards,
// }: PendingInvoicesProps) {

//   const pendingInvoices = invoices.filter(
//     (invoice: InvoicesTable) => invoice.status === "pending"
//   );

//   return <PendingInvoicesClient invoices={pendingInvoices} cards={cards} />;
// }
