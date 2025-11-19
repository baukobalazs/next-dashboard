import React from "react";
import { CustomerField, InvoiceForm } from "../lib/definitions";
import Table from "./invoices/table";
import InvoicesTable from "./invoices/table";

const SingleInvoiceForm = ({
  invoice,
  customer,
}: {
  invoice: InvoiceForm;
  customer: CustomerField;
}) => {
  return (
    <div>
      <InvoicesTable query={`${invoice.id}`} currentPage={1} />
    </div>
  );
};

export default SingleInvoiceForm;
