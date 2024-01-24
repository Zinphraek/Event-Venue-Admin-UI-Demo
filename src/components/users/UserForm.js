import React, { useState } from "react";
import { date, object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { createUser } from "./UserService";
import {
  isDateInThePast,
  is21YearsOldorOlder,
  formatDateInput,
  formatDateInput2,
  formatDateForInput,
} from "../../utils/functions/Helpers";
import Constants from "../../utils/constants/Constants";
import { useLoadingSpinner } from "../../utils/components/LoadingSpinnerProvider";

const userSchema = object().shape({
  id: string().notRequired(),
  userId: string().notRequired(),
  firstName: string().required("First name is required"),
  lastName: string().required("Last name is required"),
  email: string().email("Invalid email format.").required("Email is required"),
  phone: string().required("Phone is required"),
  username: string().notRequired(),
  gender: string().notRequired(),
  dateOfBirth: date()
    .transform((value, originalValue) => {
      return formatDateInput(originalValue) ? new Date(originalValue) : null;
    })
    .test("is-date-in-the-past", "Date must be in the past", (value) =>
      isDateInThePast(value)
    )
    .test(
      "is-at-least-21-years-old",
      "User must be at least 21 years old",
      (value) => is21YearsOldorOlder(value)
    )
    .required("Date of birth is required"),
  street: string().required("Street is required"),
  city: string().required("City is required"),
  state: string().required("State is required"),
  zipCode: string().required("Zip is required"),
});

const UserForm = (props) => {
  const {
    userToEdit,
    updateUser,
    setState,
    toggleModal,
    isUpdating = false,
  } = props;
  const [apiError, setApiError] = useState(false);

  const {
    control,
    clearErrors,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: {
      id: userToEdit?.id ?? null,
      userId: userToEdit?.userId ?? "",
      username: userToEdit?.username ?? "",
      firstName: userToEdit?.firstName ?? "",
      lastName: userToEdit?.lastName ?? "",
      email: userToEdit?.email ?? "",
      phone: userToEdit?.phone ?? "",
      dateOfBirth: userToEdit?.dateOfBirth
        ? formatDateForInput(userToEdit?.dateOfBirth)
        : "",
      gender: userToEdit?.gender ?? "",
      street: userToEdit?.street ?? "",
      city: userToEdit?.city ?? "",
      state: userToEdit?.state ?? "",
      zipCode: userToEdit?.zipCode ?? "",
      enabled: userToEdit?.enabled ?? false,
    },
  });

  const setIsLoading = useLoadingSpinner();

  const handleCancel = () => {
    clearErrors();
    reset();
    toggleModal !== undefined && toggleModal(false);
  };

  const onSubmit = async (data) => {
    data.dateOfBirth = formatDateInput2(data.dateOfBirth);

    setIsLoading(true);
    if (isUpdating) {
      updateUser(data, setIsLoading, setState, setApiError);
    } else {
      createUser(data, setIsLoading, setState, setApiError);
    }

    !apiError && reset() && setState((prev) => !prev);
    toggleModal !== undefined && !apiError && toggleModal(false);
  };

  return (
    <div className="container">
      <div className="flex flex-col items-center justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 my-8 w-full mx-auto"
        >
          <div className="flex flex-col justify-around mx-4 space-y-8 my-8 md:space-y-0 md:my-0 md:flex-row">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First name
              </label>
              <input
                {...register("firstName")}
                className={`mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md ${
                  errors.firstName ? " border-red-500" : ""
                }`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last name
              </label>
              <input
                {...register("lastName")}
                className={`mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md ${
                  errors.lastName ? " border-red-500" : ""
                }`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-around space-y-8 mx-4 my-8 md:space-y-0 md:my-0  md:flex-row">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                {...register("email")}
                className={`mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md ${
                  errors.email ? " border-red-500" : ""
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                placeholder="123-456-7890"
                {...register("phone")}
                className={`mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md ${
                  errors.phone ? " border-red-500" : ""
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-around space-y-8 mx-4 my-8 md:space-y-0 md:my-0  md:flex-row">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date of birth
              </label>
              <input
                type="date"
                placeholder="mm-dd-yyyy"
                {...register("dateOfBirth")}
                className={`mt-1 block w-full md:w-[13.6rem] h-[2.63rem] py-2 px-3 border border-gray-300 rounded-md ${
                  errors.dateOfBirth ? " border-red-500" : ""
                }`}
              />
              {errors.dateOfBirth && (
                <p className="text-red-500 text-xs">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <select
                    className={`w-full md:w-[13.6rem] h-[2.63rem] mt-1 py-2 px-3 border border-gray-300 rounded-md ${
                      errors.gender ? "border-red-500" : ""
                    }`}
                    id="gender"
                    {...field}
                  >
                    <option value="">Select your Gender</option>
                    {Constants.GENDERS.map((selectedGender, index) => (
                      <option
                        key={`gender-${index}`}
                        value={selectedGender}
                      >{`${selectedGender}`}</option>
                    ))}
                  </select>
                )}
              />

              {errors.gender && <p className="">{errors.gender.message}</p>}
            </div>
          </div>

          <div className="flex flex-col justify-around space-y-8 mx-4 my-8 md:space-y-0 md:my-0  md:flex-row">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Street
              </label>
              <input
                placeholder="123 Main St"
                {...register("street")}
                className={`mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md ${
                  errors.street ? " border-red-500" : ""
                }`}
              />
              {errors.street && (
                <p className="text-red-500 text-xs">{errors.street.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                {...register("city")}
                className={`mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md ${
                  errors.city ? " border-red-500" : ""
                }`}
              />
              {errors.city && (
                <p className="text-red-500 text-xs">{errors.city.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-around space-y-8 mx-4 my-8 md:space-y-0 md:my-0 md:flex-row">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                State
              </label>
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <select
                    className={`w-full md:w-[13.6rem] h-[2.63rem] mt-1 py-2 px-3 border border-gray-300 rounded-md ${
                      errors.state ? "border-red-500" : ""
                    }`}
                    id="eventType"
                    {...field}
                  >
                    <option value="">Select your State</option>
                    {Constants.STATES.map((stateSelected, index) => (
                      <option
                        key={`state-${index}`}
                        value={stateSelected}
                      >{`${stateSelected}`}</option>
                    ))}
                  </select>
                )}
              />
              {errors.state && (
                <p className="text-red-500 text-xs">{errors.state.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Zip Code
              </label>
              <input
                placeholder="12345"
                {...register("zipCode")}
                className={`mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md ${
                  errors.city ? " border-red-500" : ""
                }`}
              />
              {errors.city && (
                <p className="text-red-500 text-xs">{errors.zipCode.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-around space-y-8 mx-4 my-8 md:space-y-0 md:my-0 md:flex-row">
            <div className="flex flex-col w-full justify-around space-y-4 md:flex-row md:space-x-10 md:space-y-0 ">
              <button
                type="button"
                onClick={handleCancel}
                className="w-full md:w-[13.6rem] px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded font-bold"
              >
                Cancel
              </button>
            </div>

            <div className="flex flex-col w-full justify-around space-y-4 md:flex-row md:space-x-10 md:space-y-0 ">
              <button
                type="submit"
                className="w-full md:w-[13.6rem] px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
