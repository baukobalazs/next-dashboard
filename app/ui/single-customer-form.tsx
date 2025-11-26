import React from "react";
import { CustomerField, InvoiceForm } from "../lib/definitions";
import Table from "./invoices/table";
import InvoicesTable from "./invoices/table";
import CustomersTable from "./customers/table";
import CustomersTableServer from "./customers/CustomersTableServer";

const SingleCustomerForm = ({ customer }: { customer: CustomerField }) => {
  return (
    <div>
      <CustomersTableServer query={`${customer.id}`} currentPage={1} />
    </div>
  );
};

export default SingleCustomerForm;
