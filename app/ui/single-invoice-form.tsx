import React from "react";
import { CustomerField, InvoiceForm } from "../lib/definitions";
import Table from "./invoices/table";
import InvoicesTable from "./invoices/table";
import InvoicesTableServer from "./invoices/InvoicesTableServer";

const SingleInvoiceForm = ({ invoice }: { invoice: InvoiceForm }) => {
  return (
    <div>
      <InvoicesTableServer query={`${invoice.id}`} currentPage={1} />
    </div>
  );
};

export default SingleInvoiceForm;
