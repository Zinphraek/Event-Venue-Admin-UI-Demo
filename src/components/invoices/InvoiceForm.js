import React, { useState } from "react";
import PropTypes from "prop-types";
import { object, string, date, number } from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  formatDate,
  formatDateTimeForInput,
  toCamelCase,
} from "../../utils/functions/Helpers";
import Constants from "../../utils/constants/Constants";
import { createInvoice } from "./InvoiceService";
import { ToastContainer } from "react-toastify";
import { useLoadingSpinner } from "../../utils/components/LoadingSpinnerProvider";

const invoiceSchema = object().shape({
  id: number().notRequired(),
  invoiceNumber: string().notRequired(),
  issuedDate: date().required("Issued Date is required."),
  dueDate: date().required("Due Date is required."),
  status: string().required("Status is required."),
  amountDue: number().required("Amount Due is required."),
  amountPaid: number().required("Amount Paid is required."),
});

/**
 * InvoiceForm component for creating or updating an invoice.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.invoiceToEdit - The invoice object to edit (optional).
 * @param {boolean} props.isUpdating - Flag indicating if the form is for updating an existing invoice (optional).
 * @param {Object} props.reservation - The reservation object associated with the invoice.
 * @param {Function} props.setState - The function to update the state of the parent component.
 * @param {Function} props.toggleModal - The function to toggle the visibility of the modal.
 * @param {Function} props.updateInvoice - The function to update an existing invoice.
 * @param {Object} props.user - The user object associated with the invoice.
 * @returns {JSX.Element} The rendered InvoiceForm component.
 */
const InvoiceForm = (props) => {
  const {
    invoiceToEdit,
    isUpdating = false,
    reservation,
    setState,
    toggleModal,
    updateInvoice,
    user,
  } = props;
  const [apiError, setApiError] = useState(false);
  const status = [...Object.values(Constants.INVOICE_STATUS)];

  const {
    clearErrors,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(invoiceSchema),
    defaultValues: {
      id: invoiceToEdit?.id ?? null,
      invoiceNumber: invoiceToEdit?.invoiceNumber ?? `INV-000${reservation.id}`,
      issuedDate: invoiceToEdit?.issuedDate
        ? formatDateTimeForInput(invoiceToEdit.issuedDate)
        : formatDateTimeForInput(new Date()),
      dueDate: invoiceToEdit?.dueDate
        ? formatDateTimeForInput(invoiceToEdit.dueDate)
        : formatDateTimeForInput(new Date()),
      status: invoiceToEdit?.status ?? Constants.INVOICE_STATUS.DUE,
      amountDue: invoiceToEdit?.amountDue ?? reservation.totalPrice,
      amountPaid: invoiceToEdit?.amountPaid ?? 0,
    },
  });

  const setIsLoading = useLoadingSpinner();

  const handleCancel = () => {
    clearErrors();
    reset();
    toggleModal !== undefined && toggleModal(false);
  };

  const onSubmit = async (data) => {
    data.issuedDate = formatDate(data.issuedDate);
    data.dueDate = formatDate(data.dueDate);

    const reservation_ = isUpdating ? invoiceToEdit.reservation : reservation;
    const user_ = isUpdating ? invoiceToEdit.user : user;
    reservation_.startingDateTime = formatDate(reservation_.startingDateTime);
    reservation_.endingDateTime = formatDate(reservation_.endingDateTime);
    if (reservation_.effectiveEndingDateTime) {
      reservation_.effectiveEndingDateTime = formatDate(
        reservation_.effectiveEndingDateTime
      );
    } else {
      delete reservation_.effectiveEndingDateTime;
    }

    data.reservation = reservation_;
    data.user = user_;

    setIsLoading(true);

    isUpdating
      ? await updateInvoice(data, setApiError, setState, setIsLoading)
      : await createInvoice(data, setApiError, setState, setIsLoading);

    !apiError && reset();
    toggleModal !== undefined && !apiError && toggleModal(false);
  };

  return (
    <div className="bg-gray-200 container mx-auto p-8 shadow-md">
      <div className="flex flex-col justify-center items-center">
        <form className="w-full max-w-xl" onSubmit={handleSubmit(onSubmit)}>
          {/* Invoice Number */}
          <div className="flex flex-row justify-between space-x-4 mb-4">
            <label
              className="block text-gray-700 text-sm font-bold"
              htmlFor="invoiceNumber"
            >
              Invoice Number
            </label>
            <input
              className="shadow appearance-none cursor-not-allowed border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="invoiceNumber"
              type="text"
              placeholder="Invoice Number"
              {...register("invoiceNumber")}
              readOnly
            />
          </div>

          {/* Issued and Due Dates */}
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-4">
            {["Issued Date", "Due Date"].map((label, idx) => (
              <div className="flex flex-col" key={idx}>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor={label}
                >
                  {label}
                </label>
                <input
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    errors[toCamelCase(label)] ? "border-red-500" : ""
                  }`}
                  id={label}
                  type="datetime-local"
                  placeholder={label}
                  {...register(toCamelCase(label))}
                />
                {errors[toCamelCase(label)] && (
                  <p className="text-red-500 text-xs italic">
                    {errors[toCamelCase(label)].message}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Amounts Due and Paid */}
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-4">
            {["Amount Due", "Amount Paid"].map((label, idx) => (
              <div className="flex flex-col" key={idx}>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor={label}
                >
                  {label}
                </label>
                <input
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    errors[`${toCamelCase(label)}`] ? "border-red-500" : ""
                  }`}
                  id={label}
                  step={0.01}
                  type="number"
                  placeholder={label}
                  {...register(toCamelCase(label))}
                />
                {errors[toCamelCase(label)] && (
                  <p className="text-red-500 text-xs italic">
                    {errors[toCamelCase(label)].message}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Status */}
          <div className="flex flex-row justify-between space-x-4 mb-4">
            <label
              className="block text-gray-700 text-sm font-bold"
              htmlFor="status"
            >
              Status
            </label>
            <select
              className="shadow appearance-none border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="status"
              {...register("status")}
            >
              {status.map((statusItem, index) => (
                <option key={index} value={statusItem}>
                  {statusItem}
                </option>
              ))}
            </select>
          </div>

          {/* Cancel and Submit Buttons */}
          <div className="flex flex-row justify-between space-x-4 mt-8">
            <button
              className="w-1/2 bg-red-500 transition duration-300 ease-in-out hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleCancel}
              type="button"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 bg-blue-500 transition duration-300 ease-in-out hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Submit
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

InvoiceForm.propTypes = {
  invoiceToEdit: PropTypes.object,
  isUpdating: PropTypes.bool,
  reservation: PropTypes.object,
  setState: PropTypes.func,
  toggleModal: PropTypes.func,
  updateInvoice: PropTypes.func,
  user: PropTypes.object,
};

export default InvoiceForm;
