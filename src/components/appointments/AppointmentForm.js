import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { object, string, date, number } from "yup";
import Regex from "../../utils/constants/Regex";
import { yupResolver } from "@hookform/resolvers/yup";
import { createAppointment } from "./AppointmentServices";
import { useUsers } from "../provider/UserProvider";
import {
  formatDate,
  isDateInTheFuture,
  isTimeBetweenBoundaries,
  timeOptions,
} from "../../utils/functions/Helpers";
import { ToastContainer } from "react-toastify";
import { useLoadingSpinner } from "../../utils/components/LoadingSpinnerProvider";
import Constants from "../../utils/constants/Constants";
import { AppointmentShape } from "../../utils/models/AppointmentModel";

const schema = object().shape({
  id: number().nullable().optional(),
  firstName: string().required("First name is required"),
  lastName: string().required("Last name is required"),
  email: string().email().required("Email is required"),
  phone: string()
    .required("Phone is required")
    .matches(Regex.PHONE_REGEX, "Invalid phone number"),
  dateTime: date()
    .transform((value, originalValue) => {
      return originalValue ? new Date(originalValue) : null;
    })
    .test("is-between", "Time must be between 9:00 AM and 7:30 PM", (value) =>
      isTimeBetweenBoundaries(value)
    )
    .test("is-in-the-future", "Date and time must be in the future", (value) =>
      isDateInTheFuture(value)
    )
    .required("Date and time are required"),
  raison: string().required("The raison is required"),
  status: string().required("The status is required"),
  additionalInfo: string().nullable().optional(),
  userId: string().nullable().optional(),
});

/**
 * The form to create or update an appointment.
 * @param {object} props  The props passed to the component when updating an appointment.
 * @returns  The form to create or update an appointment.
 */
const AppointmentForm = (props) => {
  const {
    appointment,
    updateAppointment,
    toggleModal,
    setState,
    isUpdating = false,
  } = props;
  const [apiError, setApiError] = useState(false);
  const { usersData, setParams } = useUsers();
  const setIsLoading = useLoadingSpinner();
  const {
    clearErrors,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      id: appointment?.id ?? null,
      firstName: appointment?.firstName ?? "",
      lastName: appointment?.lastName ?? "",
      email: appointment?.email ?? "",
      phone: appointment?.phone ?? "",
      dateTime: appointment?.dateTime ?? "",
      raison: appointment?.raison ?? "",
      status: appointment?.status ?? Constants.STATUS.Pending,
      additionalInfo: appointment?.additionalInfo ?? "",
      userId: appointment?.userId ?? "",
    },
  });

  const now = new Date().toLocaleString("en-US", timeOptions);
  const todayAt12AM = new Date(now).setHours(0, 0, 0, 0);
  const nextDayAt12AM = new Date(todayAt12AM).setHours(20, 0, 0, 0);

  const minDateTime =
    new Date(now) > new Date(now).setHours(19, 30, 0, 0)
      ? new Date(nextDayAt12AM).toISOString().slice(0, 16)
      : new Date(todayAt12AM).toISOString().slice(0, 16);

  const setFalsyValuesToNull = (data) => {
    Object.keys(data).forEach((key) => {
      if (!data[key]) {
        data[key] = null;
      }
    });
    return data;
  };

  const onSubmit = async (data) => {
    data.dateTime = formatDate(data.dateTime);
    data = setFalsyValuesToNull(data);

    setIsLoading(true);
    if (isUpdating) {
      await updateAppointment(data, setApiError, setState, setIsLoading);
    } else {
      data.userId =
        usersData.content.find(
          (user) =>
            user.email === data.email &&
            user.firstName === data.firstName &&
            user.lastName === data.lastName
        )?.userId ?? null;
      await createAppointment(data, setApiError, setState, setIsLoading);
    }

    if (!apiError) {
      reset();
      toggleModal(false);
    }
  };

  const handleCancel = () => {
    clearErrors();
    reset({
      id: null,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateTime: "",
      raison: "",
      status: "",
      additionalInfo: "",
      userId: "",
    });
    toggleModal(false);
  };

  useEffect(() => {
    setParams({ pageSize: "All", page: 0 });
  }, [setParams]);

  return (
    <div className="bg-gray-100 container mx-auto p-2 md:p-10">
      <div className="flex flex-col justify-center items-center">
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-6">
            <label
              htmlFor="firstName"
              className="text-md font-bold text-gray-600"
            >
              First Name
            </label>
            <input
              placeholder="First name..."
              className={`w-full p-2 mb-2 rounded-md border ${
                errors.firstName ? "border-red-500" : "border-gray-300"
              }`}
              {...register("firstName")}
            />
            <p className="text-red-500 text-xs">{errors.firstName?.message}</p>
          </div>
          <br />
          <div>
            <label
              htmlFor="lastName"
              className="text-md font-bold text-gray-600"
            >
              Last Name
            </label>
            <input
              placeholder="Last name..."
              className={`w-full p-2 mb-2 rounded-md border ${
                errors.lastName ? "border-red-500" : "border-gray-300"
              }`}
              {...register("lastName")}
            />
            <p className="text-red-500 text-xs">{errors.lastName?.message}</p>
          </div>
          <br />
          <div>
            <label htmlFor="email" className="text-md font-bold text-gray-600">
              Email
            </label>
            <input
              placeholder="example@domain.com..."
              className={`w-full p-2 mb-2 rounded-md border ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              {...register("email")}
            />
            <p className="text-red-500 text-xs">{errors.email?.message}</p>
          </div>
          <br />
          <div>
            <label htmlFor="phone" className="text-md font-bold text-gray-600">
              Phone
            </label>
            <input
              type="text"
              placeholder="1 (614) 316-1430"
              className={`w-full p-2 mb-2 rounded-md border ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
              {...register("phone")}
            />
            <p className="text-red-500 text-xs">{errors.phone?.message}</p>
          </div>
          <br />
          <div>
            <label
              htmlFor="dateTime"
              className="text-md font-bold text-gray-600"
            >
              Date and time
            </label>
            <input
              type="datetime-local"
              min={minDateTime}
              className={`w-full p-2 mb-2 rounded-md border ${
                errors.dateTime ? "border-red-500" : "border-gray-300"
              }`}
              {...register("dateTime")}
            />
            <p className="text-red-500 text-xs">{errors.dateTime?.message}</p>
          </div>
          <br />
          <div>
            <label htmlFor="raison" className="text-md font-bold text-gray-600">
              Reason
            </label>
            <input
              placeholder="Reason..."
              className={`w-full p-2 mb-2 rounded-md border ${
                errors.raison ? "border-red-500" : "border-gray-300"
              }`}
              {...register("raison")}
            />
            <p className="text-red-500 text-xs">{errors.raison?.message}</p>
          </div>
          <br />
          <div>
            <label
              htmlFor="additionalInfo"
              className="text-md font-bold text-gray-600"
            >
              Additional info
            </label>
            <textarea
              name="additionalInfo"
              placeholder="Additional info..."
              maxLength={2000}
              rows={3}
              className={`w-full p-2 mb-2 rounded-md border ${
                errors.additionalInfo ? "border-red-500" : "border-gray-300"
              }`}
              {...register("additionalInfo")}
            />
          </div>
          <br />
          <div className="flex justify-center items-baseline">
            <label
              htmlFor="status"
              className="text-md font-bold text-gray-600 mr-10"
            >
              Status
            </label>
            <select
              className={`w-full p-2 mb-2 rounded-md border ${
                errors.status ? "border-red-500" : "border-gray-300"
              }`}
              {...register("status")}
              defaultValue={Constants.STATUS.Pending}
            >
              <option value="">Select a status</option>
              {Object.keys(Constants.STATUS).map((key) => (
                <option key={key} value={Constants.STATUS[key]}>
                  {Constants.STATUS[key]}
                </option>
              ))}
            </select>
          </div>
          <br />
          <div className="flex justify-between my-8">
            <button
              className="w-1/3 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="w-1/3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

AppointmentForm.propTypes = {
  appointment: AppointmentShape,
  updateAppointment: PropTypes.func,
  isUpdating: PropTypes.bool,
  toggleModal: PropTypes.func.isRequired,
  setState: PropTypes.func,
};

export default AppointmentForm;
