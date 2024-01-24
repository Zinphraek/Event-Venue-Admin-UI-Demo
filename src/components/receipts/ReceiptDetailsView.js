import React from "react";
import PropTypes from "prop-types";
import { ReceiptModelShape } from "../../utils/models/ReceiptModel";
import { formatDate } from "../../utils/functions/Helpers";

const PaymentMethodTable = ({ payments }) => {
  return (
    <div className="w-full rounded">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-800 text-white w-full">
          <tr>
            <th className="w-1/4 px-4 py-2">Method</th>
            <th className="w-1/4 px-4 py-2">Amount</th>
            <th className="w-1/4 px-4 py-2">Last 4 Digit</th>
            <th className="w-1/4 px-4 py-2">Other Details</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 rounded-b">
          {payments.map((payment, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{payment.method}</td>
              <td className="border px-4 py-2">${payment.amount.toFixed(2)}</td>
              <td className="border px-4 py-2">{payment.cardLastFour}</td>
              <td className="border px-4 py-2">{payment.otherDetails}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

PaymentMethodTable.propTypes = {
  payments: PropTypes.arrayOf(
    PropTypes.shape({
      method: PropTypes.string,
      amount: PropTypes.number,
      cardLastFour: PropTypes.string,
      otherDetails: PropTypes.string,
    })
  ).isRequired,
};

const ReceiptDetailsView = (props) => {
  const { receipt, toggleModal } = props;

  return (
    <div className="bg-gray-100 container mx-auto py-6 px-4 rounded-lg shadow-md w-full">
      <div className="flex flex-col justify-center items-center px-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Receipt Details
        </h1>
        <div className="flex flex-wrap justify-between w-full mb-4">
          <div className="flex items-center mb-2">
            <h2 className="text-lg font-semibold text-gray-800 mr-2">
              Receipt Number:
            </h2>
            <p className="text-lg text-gray-800">{receipt.receiptNumber}</p>
          </div>
          <div className="flex items-center mb-2">
            <h2 className="text-lg font-semibold text-gray-800 mr-2">
              Receipt Date:
            </h2>
            <p className="text-lg text-gray-800">
              {formatDate(receipt.receiptDate)}
            </p>
          </div>
          <div className="flex items-center mb-2">
            <h1 className="text-lg font-semibold text-gray-800 mr-2">
              Amount Paid:
            </h1>
            <p className="text-lg text-gray-800">
              ${receipt.amountPaid.toFixed(2)}
            </p>
          </div>
          <div className="flex items-center mb-2">
            <h2 className="text-lg font-semibold text-gray-800 mr-2">
              Balance Due:
            </h2>
            <p className="text-lg text-gray-800">
              ${receipt.balanceDue.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap justify-between w-full mb-4">
          <div className="flex items-center mb-2">
            <h2 className="text-lg font-semibold text-gray-800 mr-2">
              Paid By:
            </h2>
            <p className="text-lg text-gray-800">{receipt.paidBy}</p>
          </div>
          <div className="flex items-center mb-2">
            <h2 className="text-lg font-semibold text-gray-800 mr-2">
              Payment Date:
            </h2>
            <p className="text-lg text-gray-800">
              {formatDate(receipt.paymentDate)}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap justify-between w-full mb-4">
          <div className="flex items-center mb-2">
            <h2 className="text-lg font-semibold text-gray-800 mr-2">
              Cashier:
            </h2>
            <p className="text-lg text-gray-800">{receipt.cashierName}</p>
          </div>
          <div className="flex items-center mb-2">
            <h2 className="text-lg font-semibold text-gray-800 mr-2">
              Comment:
            </h2>
            <p className="text-lg text-gray-800">{receipt.comment}</p>
          </div>
        </div>

        <h3 className="text-xl text-center font-semibold mb-4 text-gray-800 w-full">
          Payment Breakdown
        </h3>
        {/* PaymentMethodTable component */}
        <div className="flex w-full border-gray-400 border rounded">
          <PaymentMethodTable payments={receipt.payments} />
        </div>
        <div className="flex w-full justify-end mt-4">
          <button
            onClick={() => toggleModal(false)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

ReceiptDetailsView.propTypes = {
  receipt: ReceiptModelShape.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

export default ReceiptDetailsView;
