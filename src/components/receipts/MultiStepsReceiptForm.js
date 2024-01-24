import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  EntitiesListResponseModel,
  EntitiesListResponseModelShape,
} from "../../utils/models/EntitiesListResponseModel";
import { UserModel } from "../../utils/models/UserModel";
import { getAllInvoicesByUserId } from "../invoices/InvoiceService";
import { USDollar, getDateSting } from "../../utils/functions/Helpers";
import ReceiptForm from "./ReceiptForm";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";
import { useLoadingSpinner } from "../../utils/components/LoadingSpinnerProvider";
import { InvoiceModel } from "../../utils/models/InvoiceModel";
import Constants from "../../utils/constants/Constants";

const MultiStepsReceiptForm = (props) => {
  const { setState, toggleModal, usersData } = props;
  const [currentStep, setCurrentStep] = useState(0);
  const [user, setUser] = useState(UserModel);
  const [invoicesData, setInvoicesData] = useState(EntitiesListResponseModel);
  const setIsLoading = useLoadingSpinner();
  const [invoice, setInvoice] = useState(InvoiceModel);

  const enableNextStepButton = () => !!user.userId && !!invoice.id;

  const nextSlide = () => {
    if (currentStep < 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousSlide = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSelectUserChange = (e) => {
    const selectedUser = usersData.content.find(
      (u) => u.userId === e.target.value
    );
    setUser(selectedUser);
  };

  const onSelectInvoicesChange = (e) => {
    const invoice = invoicesData.content.find(
      (r) => r.id === parseInt(e.target.value)
    );
    setInvoice(invoice);
  };

  useEffect(() => {
    if (user.userId) {
      getAllInvoicesByUserId(setInvoicesData, user.userId, setIsLoading);
    }
  }, [user.userId, setIsLoading]);

  return (
    <div>
      <div className="relative w-full h-full overflow-hidden border">
        <div
          className={`flex w-full h-full transition-transform duration-500 transform ${
            currentStep === 0 ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="w-full h-full flex-none items-center justify-center bg-blue-500">
            <div className="flex flex-col justify-stretch items-center">
              <div className="flex flex-col justify-center items-center p-10">
                <h1 className="text-white text-3xl">Select a User</h1>
                <select
                  className="w-full p-2 mt-2 rounded-md border border-gray-300"
                  onChange={onSelectUserChange}
                >
                  <option value={null}>Select a User</option>
                  {usersData.content.map((user) => (
                    <option key={user.userId} value={user.userId}>
                      {user.firstName} {user.lastName}
                    </option>
                  ))}
                </select>
              </div>
              {user.userId && invoicesData.content ? (
                <div className="flex flex-col justify-center items-center p-10">
                  <h1 className="text-white text-3xl">Select an Invoice</h1>
                  <select
                    className="p-2 mt-2 rounded-md border border-gray-300"
                    onChange={onSelectInvoicesChange}
                  >
                    <option value={null}>Select Invoive</option>
                    {invoicesData.content
                      .filter(
                        (invoice) =>
                          invoice.status !== Constants.INVOICE_STATUS.PAID &&
                          invoice.status !== Constants.INVOICE_STATUS.WITHDWAWN
                      )
                      .map((invoice) => (
                        <option key={invoice.id} value={invoice.id}>
                          {getDateSting(invoice.issuedDate)} - {invoice.status}{" "}
                          - {USDollar.format(invoice.amountDue)}
                        </option>
                      ))}
                  </select>
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center">
                  No unpaid invoices found
                </div>
              )}
            </div>
          </div>
          <div className="w-full h-full mt-6 mb-0 flex-none flex items-center justify-cente">
            {user.userId && invoice.id && currentStep > 0 && (
              <ReceiptForm
                invoice={invoice}
                setState={setState}
                toggleModal={toggleModal}
              />
            )}
          </div>
        </div>
      </div>
      {currentStep === 0 && (
        <button
          className={`relative m-2 p-2 ${
            enableNextStepButton() ? "bg-indigo-600" : "bg-gray-500"
          } text-white float-right rounded-md`}
          onClick={nextSlide}
          disabled={!enableNextStepButton()}
        >
          <div className="flex flex-row items-center justify-center">
            Next
            <ChevronDoubleRightIcon
              className="w-5 h-5 ml-2"
              aria-hidden="true"
            />
          </div>
        </button>
      )}
      {currentStep === 1 && (
        <button
          className="relative m-2 p-2 bg-indigo-600 text-white float-left rounded-md"
          onClick={previousSlide}
        >
          <div className="flex flex-row items-center justify-center">
            <ChevronDoubleLeftIcon
              className="w-5 h-5 ml-2"
              aria-hidden="true"
            />
            Previous
          </div>
        </button>
      )}
    </div>
  );
};

MultiStepsReceiptForm.propTypes = {
  setState: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
  usersData: EntitiesListResponseModelShape.isRequired,
};

export default MultiStepsReceiptForm;
