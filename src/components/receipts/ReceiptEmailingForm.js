import React, { useState } from "react";
import PropTypes from "prop-types";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import { emailReceipt } from "./ReceiptService";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLoadingSpinner } from "../../utils/components/LoadingSpinnerProvider";

const receiptEmailSchema = object().shape({
  address: string()
    .email("Invalid email address")
    .required("Email address is required"),
  subject: string().required("Subject is required"),
  body: string().required("Body is required"),
});

const ReceiptEmailingForm = (props) => {
  const { receiptId, emailAddress, toggleModal } = props;
  const setIsLoading = useLoadingSpinner();
  const [apiError, setApiError] = useState(false);
  const {
    clearErrors,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(receiptEmailSchema),
    defaultValues: {
      address: emailAddress,
      subject: "",
      body: "",
    },
  });

  const handleCancel = () => {
    clearErrors();
    reset();
    toggleModal !== undefined && toggleModal(false);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    await emailReceipt(receiptId, data, setApiError, setIsLoading);
    !apiError && toggleModal(false);
  };
  return (
    <div className="bg-gray-100 container mx-auto p-6 rounded-lg shadow-md">
      <div className="flex flex-col justify-between items-center">
        <form
          className="w-full px-8 space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col space-y-2 pt-4">
            <div className="flex items-center justify-center">
              <h1 className="ml-2 text-xl font-bold">Email Receipt</h1>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="my-4 text-left">
                The receipt will be sent to the email address displayed below.
                Change it if you want to send to a different email address.
              </p>
            </div>
            <label className="text-sm font-bold text-gray-600">To</label>
            <input
              className={`w-full p-2 mb-2 rounded-md border ${
                errors.address ? "border-red-500" : "border-gray-300"
              }`}
              type="text"
              {...register("address")}
            />
            {errors.address && (
              <p className="text-xs text-red-500">{errors.address.message}</p>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-bold text-gray-600">Subject</label>
            <input
              className={`w-full p-2 mb-2 rounded-md border ${
                errors.subject ? "border-red-500" : "border-gray-300"
              }`}
              type="text"
              {...register("subject")}
            />
            {errors.subject && (
              <p className="text-xs text-red-500">{errors.subject.message}</p>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-bold text-gray-600">Body</label>
            <textarea
              className={`w-full p-2 mb-2 rounded-md border ${
                errors.body ? "border-red-500" : "border-gray-300"
              }`}
              type="text"
              rows={4}
              {...register("body")}
            />
            {errors.body && (
              <p className="text-xs text-red-500">{errors.body.message}</p>
            )}
          </div>
          <div className="flex justify-between">
            <button
              className="w-1/3 p-2 mb-2 rounded-md border bg-red-500 border-gray-300 hover:bg-red-700 hover:text-white"
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="w-1/3 p-2 mb-2 rounded-md border border-gray-300 bg-blue-500 hover:bg-blue-700 hover:text-white"
              type="submit"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ReceiptEmailingForm.propTypes = {
  receiptId: PropTypes.number.isRequired,
  emailAddress: PropTypes.string.isRequired,
  toggleModal: PropTypes.func,
};

export default ReceiptEmailingForm;
