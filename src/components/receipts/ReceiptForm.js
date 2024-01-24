import React, { useState } from "react";
import PropTypes from "prop-types";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { array, object, string, date, number } from "yup";
import KeycloakService from "../config/KeycloakService";
import Constants from "../../utils/constants/Constants";
import MultiPaymentForm from "./MultiPaymentForm";
import {
  formatDate,
  formatDateTimeForInput,
  isDateTimeInThePast,
} from "../../utils/functions/Helpers";
import { ToastContainer } from "react-toastify";
import { createReceipt } from "./ReceiptService";
import { useLoadingSpinner } from "../../utils/components/LoadingSpinnerProvider";

const paymentSchema = object().shape({
  method: string().required("Payment method is required"),
  amount: number("Amount must be a number")
    .required("Amount is required")
    .positive("Amount should be positive"),
  cardLastFour: string().when("method", {
    is: Constants.PAYMENT_METHODS.card,
    then: (schema) =>
      schema
        .required("Last 4 digits of the card are required")
        .length(4, "Should be exactly 4 digits"),
  }),
  otherDetails: string().when("method", {
    is: Constants.PAYMENT_METHODS.other,
    then: (schema) => schema.required("Payment method details are required"),
  }),
});

const receiptSchema = object().shape({
  id: number().notRequired(),
  receiptNumber: string().notRequired(),
  receiptDate: date().notRequired(),
  amountPaid: number("Amount paid must be a number")
    .required("Amount paid is required")
    .positive("Amount should be positive"),
  reservationId: number().required("Reservation ID is required"),
  userId: string().required("User ID is required"),
  invoiceId: number().required("Invoice ID is required"),
  payments: array()
    .of(paymentSchema)
    .test(
      "is-total-amount-paid-greather-than-balance-due",
      "Total amount paid cannot be greater than balance due.",
      function (value) {
        return !(this.parent.balanceDue < 0);
      }
    ),
  paidBy: string().required("Paid by is required"),
  paymentDate: date("Payment date must be a date")
    .transform((value, originalValue) => {
      return originalValue ? new Date(originalValue) : null;
    })
    .test("is-date-in-the-past", "Date must be in the past", (value) =>
      isDateTimeInThePast(value)
    )
    .required("Payment date is required"),
  prevBalance: number("Previous balance must be a number")
    .required("Previous balance is required")
    .min(0, "Amount should be positive or equal to 0"),
  balanceDue: number("Balance Due must be a number").required(
    "Balance due is required"
  ),
  cashierName: string().required("Cashier name is required"),
});

const ReceiptForm = (props) => {
  const {
    invoice,
    receiptToEdit,
    updateReceipt,
    toggleModal,
    setState,
    isUpdating = false,
  } = props;

  const setIsLoading = useLoadingSpinner();
  const [apiError, setApiError] = useState(false);
  const {
    clearErrors,
    control,
    getValues,
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(receiptSchema),
    defaultValues: {
      id: receiptToEdit?.id ?? null,
      receiptNumber: receiptToEdit?.receiptNumber ?? null,
      receiptDate: receiptToEdit?.receiptDate
        ? formatDateTimeForInput(receiptToEdit.receiptDate)
        : formatDateTimeForInput(new Date()),
      amountPaid: receiptToEdit?.amountPaid ?? 0.0,
      reservationId: receiptToEdit?.reservationId ?? invoice.reservation.id,
      userId: receiptToEdit?.userId ?? invoice.user.userId,
      invoiceId: receiptToEdit?.invoiceId ?? invoice.id,
      payments: receiptToEdit?.payments ?? [{ method: "", amount: 0.0 }],
      paidBy: receiptToEdit?.paidBy ?? "",
      paymentDate: receiptToEdit?.paymentDate ?? "",
      prevBalance:
        receiptToEdit?.prevBalance ??
        (!!invoice.amountPaid && invoice.amountDue > 0
          ? invoice.amountDue
          : 0.0),
      balanceDue: receiptToEdit?.balanceDue ?? invoice.amountDue,
      cashierName:
        receiptToEdit?.cashierName ?? KeycloakService.getUserFullName(),
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "payments",
  });

  const methods = watch("payments");

  const handleCancel = () => {
    clearErrors();
    reset();
    toggleModal !== undefined && toggleModal(false);
  };

  const onSubmit = async (data) => {
    data.receiptDate = formatDate(data.receiptDate);
    data.paymentDate = formatDate(data.paymentDate);

    setIsLoading(true);
    if (isUpdating) {
      await updateReceipt(data, setApiError, setIsLoading);
    } else {
      await createReceipt(data, setApiError, setIsLoading);
    }
    !apiError && reset();
    !apiError && setState((prev) => !prev);
    toggleModal !== undefined && !apiError && toggleModal(false);
  };

  const handlePaymentMethodRemove = (index) => {
    setValue("amountPaid", getValues().amountPaid - fields[index].amount);
    setValue("balanceDue", getValues().balanceDue + fields[index].amount);
    remove(index);
    clearErrors(`payments[${index}].method`);
  };

  const handlePaymentMethodAmountChange = (onChange) => (e, index) => {
    const value = parseFloat(e.target.value);
    const data = getValues();
    const oldAmount = fields[index].amount;
    const oldTotalAmountPaid = data.amountPaid;
    const oldBalanceDue = data.balanceDue;

    if (oldAmount) {
      if (value) {
        setValue("amountPaid", oldTotalAmountPaid - oldAmount + value);
        setValue("balanceDue", oldBalanceDue + oldAmount - value);
      } else {
        setValue("amountPaid", oldTotalAmountPaid - oldAmount);
        setValue("balanceDue", oldBalanceDue + oldAmount);
      }
    } else {
      setValue("amountPaid", oldTotalAmountPaid + value);
      setValue("balanceDue", oldBalanceDue - value);
    }

    const newFields = [...fields];
    newFields[index].amount = value;

    update([...newFields]);
    setValue(`payments[${index}].amount`, value);
    onChange(e);
  };

  return (
    <div className="bg-gray-100 container mx-auto p-6 rounded-lg shadow-md">
      <div className="flex flex-col justify-between items-center">
        <form
          className="w-full px-8 space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col md:flex-row justify-between space-y-6 md:space-y-0">
            <div className="flex flex-row justify-between items-baseline">
              <label className="block text-sm font-medium text-gray-700">
                Receipt Date
              </label>

              <div className="flex flex-col items-baseline space-y-1 mx-1">
                <input
                  type="datetime-local"
                  {...register("receiptDate")}
                  value={getValues().receiptDate}
                  className={`mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md cursor-not-allowed ${
                    errors.receiptDate ? " border-red-500" : ""
                  }`}
                  readOnly
                />
                {errors.receiptDate && (
                  <span className="text-red-500 text-sm">
                    {errors.receiptDate.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-row items-baseline">
              <label className="block text-sm font-medium text-gray-700">
                Payment Date
              </label>

              <div className="flex flex-col space-y-1 mx-1">
                <input
                  type="datetime-local"
                  max={new Date().toISOString().slice(0, 16)}
                  {...register("paymentDate")}
                  className={`mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md ${
                    errors.paymentDate ? " border-red-500" : ""
                  }`}
                />
                {errors.paymentDate && (
                  <span className="text-red-500 text-sm">
                    {errors.paymentDate.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Amount Paid and Previous Balance */}
          <div className="flex flex-col justify-between space-y-8 my-2 md:space-y-0 md:flex-row">
            {/* Previous Balance */}
            <div className="flex flex-row items-baseline space-x-1">
              <label className="block text-sm font-medium text-gray-700">
                Previous Balance
              </label>

              <div className="flex flex-col space-y-1 mx-1">
                <input
                  type="number"
                  inputMode="numeric"
                  {...register("prevBalance")}
                  className={`mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md cursor-not-allowed ${
                    errors.prevBalance ? " border-red-500" : ""
                  }`}
                  readOnly
                />
                {errors.prevBalance && (
                  <span className="text-red-500 text-sm">
                    {errors.prevBalance.message}
                  </span>
                )}
              </div>
            </div>

            {/* Amount Paid */}
            <div className="flex flex-row items-baseline space-x-1">
              <label className="block text-sm font-medium text-gray-700">
                Amount Paid
              </label>

              <div className="flex flex-col space-y-1 mx-1">
                <input
                  type="number"
                  inputMode="numeric"
                  {...register("amountPaid")}
                  className={`mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md cursor-not-allowed ${
                    errors.amountPaid ? " border-red-500" : ""
                  }`}
                  readOnly
                />
                {errors.amountPaid && (
                  <span className="text-red-500 text-sm">
                    {errors.amountPaid.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Balance Due */}
          <div className="flex flex-row space-x-1">
            <label className="block text-sm font-medium text-gray-700">
              Balance Due
            </label>

            <div className="flex flex-col space-y-1 mx-1 w-full">
              <input
                type="number"
                inputMode="numeric"
                {...register("balanceDue")}
                className={`mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md cursor-not-allowed ${
                  errors.balanceDue ? " border-red-500" : ""
                }`}
                readOnly
              />
              {errors.balanceDue && (
                <span className="text-red-500 text-sm">
                  {errors.balanceDue.message}
                </span>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div className="flex flex-col space-x-1 my-2 mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Payment Methods
            </label>

            <div className="flex flex-col space-y-1">
              <div className="flex flex-row space-x-1 m-2 overflow-x-scroll no-scrollbar">
                <MultiPaymentForm
                  addPayment={() => append({ method: "", amount: 0.0 })}
                  amountChangeHandler={handlePaymentMethodAmountChange}
                  control={control}
                  Controller={Controller}
                  errors={errors}
                  fields={fields}
                  register={register}
                  methods={methods}
                  removePayment={handlePaymentMethodRemove}
                />
              </div>
              {errors.payments && (
                <span className="text-red-500 text-sm">
                  {errors.payments.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-between items-baseline space-y-8 my-2 md:space-y-0 md:flex-row">
            {/* Paid By */}
            <div className="flex flex-row items-baseline my-2 mx-1">
              <label className="block text-sm font-medium text-gray-700">
                Paid By
              </label>

              <div className="flex flex-col space-y-1 mx-1">
                <input
                  type="text"
                  {...register("paidBy")}
                  className={`mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md ${
                    errors.paidBy ? " border-red-500" : ""
                  }`}
                />
                {errors.paidBy && (
                  <span className="text-red-500 text-sm">
                    {errors.paidBy.message}
                  </span>
                )}
              </div>
            </div>

            {/* Cashier Name */}
            <div className="flex flex-row items-baseline my-2">
              <label className="block text-sm font-medium text-gray-700">
                Cashier Name
              </label>

              <div className="flex flex-col space-y-1 mx-1">
                <input
                  {...register("cashierName")}
                  className={`mt-1 block w-full h-11 px-3 border border-gray-300 rounded-md cursor-not-allowed ${
                    errors.cashierName ? " border-red-500" : ""
                  }`}
                  readOnly
                />
                {errors.cashierName && (
                  <span className="text-red-500 text-sm">
                    {errors.cashierName.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Cancel and Submit Buttons */}
          <div className="flex flex-row justify-between space-x-4 mt-8">
            <button
              className="w-1/3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2 px-4 rounded transform transition-transform duration-150 hover:scale-105"
              onClick={handleCancel}
              type="button"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-500 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded transform transition-transform duration-150 hover:scale-105"
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

ReceiptForm.propTypes = {
  invoice: PropTypes.object.isRequired,
  receiptToEdit: PropTypes.object,
  updateReceipt: PropTypes.func,
  toggleModal: PropTypes.func,
  setState: PropTypes.func,
  isUpdating: PropTypes.bool,
};

export default ReceiptForm;
