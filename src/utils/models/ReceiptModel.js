import PropTypes from "prop-types";

export const ReceiptModel = {
  id: null,
  receiptNumber: "",
  receiptDate: "",
  amountPaid: 0.0,
  reservationId: "",
  userId: "",
  invoiceId: "",
  payments: [{ method: "", amount: 0.0, cardLastFour: "", otherDetails: "" }],
  paidBy: "",
  paymentDate: "",
  prevBalance: 0.0,
  balanceDue: "",
  cashierName: "",
  comment: "",
};

export const ReceiptModelShape = PropTypes.shape({
  id: PropTypes.number,
  receiptNumber: PropTypes.string,
  receiptDate: PropTypes.string,
  amountPaid: PropTypes.number,
  reservationId: PropTypes.number,
  userId: PropTypes.string,
  invoiceId: PropTypes.number,
  payments: PropTypes.arrayOf(
    PropTypes.shape({
      method: PropTypes.string,
      amount: PropTypes.number,
      cardLastFour: PropTypes.string,
      otherDetails: PropTypes.string,
    })
  ),
  paidBy: PropTypes.string,
  paymentDate: PropTypes.string,
  prevBalance: PropTypes.number,
  balanceDue: PropTypes.number,
  cashierName: PropTypes.string,
  comment: PropTypes.string,
});
