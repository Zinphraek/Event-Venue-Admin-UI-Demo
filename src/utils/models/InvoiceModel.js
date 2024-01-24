import { ReservationModel } from "./ReservationModel";
import { UserModel } from "./UserModel";

export const InvoiceModel = {
  id: "",
  invoiceNumber: "",
  issuedDate: "",
  dueDate: "",
  status: "",
  amountDue: "",
  totalAmountPaid: "",
  reservation: ReservationModel,
  user: UserModel,
};
