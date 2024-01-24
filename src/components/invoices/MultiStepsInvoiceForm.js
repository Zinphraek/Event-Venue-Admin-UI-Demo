import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { EntitiesListResponseModel } from "../../utils/models/EntitiesListResponseModel";
import { UserModel } from "../../utils/models/UserModel";
import { getReservationByUserId } from "../reservations/ReservationsServices";
import { ReservationModel } from "../../utils/models/ReservationModel";
import { USDollar, getDateSting } from "../../utils/functions/Helpers";
import InvoiceForm from "./InvoiceForm";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";
import { useLoadingSpinner } from "../../utils/components/LoadingSpinnerProvider";

const MultiStepsInvoiceForm = (props) => {
  const { setState, toggleModal, usersData } = props;
  const [currentStep, setCurrentStep] = useState(0);
  const [user, setUser] = useState(UserModel);
  const [reservationData, setReservationData] = useState(
    EntitiesListResponseModel
  );
  const setIsLoading = useLoadingSpinner();
  const [reservation, setReservation] = useState(ReservationModel);

  const enableNextStepButton = () => !!user.userId && !!reservation.id;

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

  const onSelectReservationChange = (e) => {
    const reservation = reservationData.content.find(
      (r) => r.id === parseInt(e.target.value)
    );
    setReservation(reservation);
  };

  useEffect(() => {
    if (user.userId) {
      getReservationByUserId(setReservationData, user.userId, setIsLoading);
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
              <div className="flex flex-col justify-center items-center p-14">
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
              {user.userId && reservationData.content ? (
                <div className="flex flex-col justify-center items-center p-12">
                  <h1 className="text-white text-3xl">Select A Reservation</h1>
                  <select
                    className="p-2 mt-2 rounded-md border border-gray-300"
                    onChange={onSelectReservationChange}
                  >
                    <option value={null}>Select a Reservation</option>
                    {reservationData.content.map((reservation) => (
                      <option key={reservation.id} value={reservation.id}>
                        {getDateSting(reservation.startingDateTime)} -{" "}
                        {reservation.eventType} -{" "}
                        {USDollar.format(reservation.totalPrice)}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center">
                  No reservations found
                </div>
              )}
            </div>
          </div>
          <div className="w-full h-full mb-0 flex-none flex items-center justify-cente">
            {user.userId && reservation.id && (
              <InvoiceForm
                user={user}
                reservation={reservation}
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

MultiStepsInvoiceForm.propTypes = {
  setState: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

export default MultiStepsInvoiceForm;
