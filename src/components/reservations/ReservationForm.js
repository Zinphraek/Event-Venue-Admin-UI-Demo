import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ToastContainer } from "react-toastify";
import { useAddOns } from "../provider/AddOnsProvider";
import Constants from "../../utils/constants/Constants";
import { Services } from "../../utils/models/ServiceModel";
import AddonsList from "../addons/AddonsList";
import { computeSubtotal } from "../../utils/functions/Helpers";
import { createReservation } from "./ReservationsServices";
import {
  reservationSchema,
  ReservationModel,
  defaultDiscount,
} from "../../utils/models/ReservationModel";
import {
  formatDate,
  USDollar,
  extractAddOnPrice,
  generateInitialSubtotalBreakDown,
  timeOptions,
} from "../../utils/functions/Helpers";
import { useLoadingSpinner } from "../../utils/components/LoadingSpinnerProvider";

/**
 * The reservation form.
 * @param {object} props The reservation object and its events' handlers as well as the errors states.
 * @returns The partial reservation form component.
 */
const ReservationForm = (props) => {
  const {
    reservation,
    updateReservation,
    usersData,
    toggleModal,
    setState,
    isEditing = false,
  } = props;
  const { addOnsData, setParams } = useAddOns();
  const setIsLoading = useLoadingSpinner();
  const [apiError, setApiError] = useState(false);

  const status = [...Object.values(Constants.STATUS)];

  const {
    clearErrors,
    control,
    getValues,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(reservationSchema),
    defaultValues: {
      id: reservation?.id ?? null,
      startingDateTime: reservation?.startingDateTime ?? "",
      endingDateTime: reservation?.endingDateTime ?? "",
      effectiveEndingDateTime: reservation?.effectiveEndingDateTime ?? "",
      eventType: reservation?.eventType ?? "",
      numberOfSeats: reservation?.numberOfSeats ?? "",
      addOns: reservation?.addOns ?? [],
      addOnsTotalCost: reservation?.addOnsTotalCost ?? 0,
      status: reservation?.status ?? Constants.STATUS.Pending,
      fullPackage: reservation?.fullPackage ?? false,
      securityDepositRefunded: reservation?.securityDepositRefunded ?? false,
      taxRate: reservation?.taxRate ?? Constants.TAXE_RATE,
      totalPrice: reservation?.totalPrice ?? 0,
      discount: reservation?.discount ?? defaultDiscount,
      userId: reservation?.userId ?? "",
    },
  });

  const discountType = watch("discount.type");

  const now = new Date().toLocaleString("en-US", timeOptions);
  const todayAt12AM = new Date(now).setHours(0, 0, 0, 0);
  const nextDayAt12AM = new Date(todayAt12AM).setHours(20, 0, 0, 0);

  const minDateTime =
    new Date(now) > new Date(now).setHours(19, 30, 0, 0)
      ? new Date(nextDayAt12AM).toISOString().slice(0, 16)
      : new Date(todayAt12AM).toISOString().slice(0, 16);

  const initialSubBreakDown = generateInitialSubtotalBreakDown(reservation);

  const [subTotal, setSubTotal] = useState(
    reservation ? reservation.totalPrice / (1 + reservation.taxRate) : 0
  );
  const [taxe, setTaxe] = useState(
    reservation ? reservation.totalPrice - subTotal : 0
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [subTotalBreakDown, setSubTotalBreakDown] =
    useState(initialSubBreakDown);

  const primaryServices = Services.slice(0, -1)
    .filter((service) => service.available)
    .sort((a, b) => a.title.localeCompare(b.title));
  const otherService = Services[Services.length - 1];

  const resetForm = () => {
    reset();
    setTaxe(0);
    setSubTotal(0);
    setSearchQuery("");
    setValue("addOns", []);
    setCategoryFilters([]);
    setSubTotalBreakDown(generateInitialSubtotalBreakDown(ReservationModel));

    clearErrors();
    toggleModal !== undefined && toggleModal(false);
  };

  const onSubmit = async (data) => {
    data.startingDateTime = formatDate(data.startingDateTime);
    data.endingDateTime = formatDate(data.endingDateTime);
    if (data.effectiveEndingDateTime) {
      data.effectiveEndingDateTime = formatDate(data.effectiveEndingDateTime);
    } else {
      delete data.effectiveEndingDateTime;
    }

    data.discount = data.discount === defaultDiscount ? null : data.discount;
    setIsLoading(true);
    if (isEditing) {
      await updateReservation(data, setState, setApiError, setIsLoading);
    } else {
      await createReservation(data, setState, setApiError, setIsLoading);
    }
    !apiError && resetForm();
  };

  const rateNames = [
    "SEAT_RATE_NAME",
    "OVERTIME_HOURLY_RATE_NAME",
    "REGULAR_FACILITY_RATE_NAME",
    "SATURDAY_FACILITY_RATE_NAME",
    "CLEANING_FEES_SMALL_GUESTS_COUNT_NAME",
    "CLEANING_FEES_LARGE_GUESTS_COUNT_NAME",
  ];

  const rates = rateNames.reduce((acc, rateName) => {
    let key = rateName.toLowerCase().replace(/_name$/, "");
    key = key
      .split("_")
      .map((word, index) =>
        index !== 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word
      )
      .join("");

    acc[key] = extractAddOnPrice(addOnsData.content, Constants[rateName]);
    return acc;
  }, {});

  const applyDiscount = (subtotal, discount) => {
    if (discount.type === Constants.DISCOUNT_TYPES.Amount) {
      return subtotal - discount.amount;
    }
    if (discount.type === Constants.DISCOUNT_TYPES.Percentage) {
      return subtotal - subtotal * (discount.percentage / 100);
    }
    return subtotal;
  };

  const applyTaxes = (subtotal, taxRate) => {
    return subtotal * taxRate;
  };

  const computeTotal = (subtotal, discount, taxRate) => {
    const subtotalAfterDiscount = applyDiscount(subtotal, discount);
    const taxe = applyTaxes(subtotalAfterDiscount, taxRate);
    setTaxe(taxe);
    return subtotalAfterDiscount + taxe;
  };

  /**
   * Handle the discount value change.
   * @param {object} onChange The discount value change event.
   * @param {object} e The discount value input event.
   */
  const handleDiscountValueChange = (onChange) => (e) => {
    const discountValue = e.target.valueAsNumber;
    if (!(typeof discountValue === "number" && !isNaN(discountValue))) {
      onChange(0);
    } else {
      onChange(discountValue);
    }
    const data = getValues();
    setValue("totalPrice", computeTotal(subTotal, data.discount, data.taxRate));
  };

  /**
   * Handle the guest count value change.
   * @param {object} e The guest count input event.
   */
  const handleGuestCountChange = (e) => {
    let numberOfSeats = e.target.valueAsNumber;
    const data = getValues();
    if (!(typeof numberOfSeats === "number" && !isNaN(numberOfSeats))) {
      setValue("numberOfSeats", "");
      numberOfSeats = 0;
    } else {
      setValue("numberOfSeats", numberOfSeats);
    }
    const dateTimes = {
      startingDateTime: data.startingDateTime,
      endingDateTime: data.endingDateTime,
      effectiveEndingDateTime: data.effectiveEndingDateTime,
    };
    const subtotal = computeSubtotal(
      data.addOnsTotalCost,
      numberOfSeats,
      dateTimes,
      rates,
      setSubTotalBreakDown
    );
    setSubTotal(subtotal);

    setValue("totalPrice", computeTotal(subtotal, data.discount, data.taxRate));
  };

  /**
   * Handle the reservation ending date and time value change.
   * @param {Object} e The reservation ending date and time value input event.
   */
  const handleEndingDatetimeChange = (onChange) => (e) => {
    const endingDateTime = e.target.value;
    onChange(endingDateTime);
    const data = getValues();
    const dateTimes = {
      startingDateTime: data.startingDateTime,
      endingDateTime: endingDateTime,
      effectiveEndingDateTime: data.effectiveEndingDateTime,
    };
    const subtotal = computeSubtotal(
      data.addOnsTotalCost,
      data.numberOfSeats,
      dateTimes,
      rates,
      setSubTotalBreakDown
    );
    setSubTotal(subtotal);

    setValue("totalPrice", computeTotal(subtotal, data.discount, data.taxRate));
  };

  /**
   * Handle the reservation effective ending date and time value change.
   * @param {Object} e The reservation effective ending date and time value input event.
   */
  const handleEffectiveEndingDatetimeChange = (onChange) => (e) => {
    const effectiveEndingDateTime = e.target.value;
    onChange(effectiveEndingDateTime);
    const data = getValues();
    const dateTimes = {
      startingDateTime: data.startingDateTime,
      endingDateTime: data.endingDateTime,
      effectiveEndingDateTime: effectiveEndingDateTime,
    };
    const subtotal = computeSubtotal(
      data.addOnsTotalCost,
      data.numberOfSeats,
      dateTimes,
      rates,
      setSubTotalBreakDown
    );

    setSubTotal(subtotal);
    setValue("totalPrice", computeTotal(subtotal, data.discount, data.taxRate));
  };

  /**
   * Handle the reservation starting date and time value change.
   * @param {object} e The reservation starting date and time value input event.
   */
  const handleStartingDateTimeChange = (onChange) => (e) => {
    const startingDateTime = e.target.value;
    onChange(startingDateTime);
    const data = getValues();
    const dateTimes = {
      startingDateTime: startingDateTime,
      endingDateTime: data.endingDateTime,
      effectiveEndingDateTime: data.effectiveEndingDateTime,
    };
    const subtotal = computeSubtotal(
      data.addOnsTotalCost,
      data.numberOfSeats,
      dateTimes,
      rates,
      setSubTotalBreakDown
    );
    setSubTotal(subtotal);

    setValue("totalPrice", computeTotal(subtotal, data.discount, data.taxRate));
  };

  /**
   * Handle the addOns' category selection.
   * @param {String} option The category selection event.
   */
  const handleCategoryFilterChange = (option) => {
    const selectedCategory = option;
    if (categoryFilters.includes(selectedCategory)) {
      setCategoryFilters(
        categoryFilters.filter((category) => category !== selectedCategory)
      );
    } else {
      setCategoryFilters([...categoryFilters, selectedCategory]);
    }
  };

  /**
   * Handle the search string change.
   * @param {object} event The search typing event.
   */
  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  /**
   * Handle the change in quantity of a selected addOn.
   * @param {object} selectedItem The addOn selected
   * @param {number} quantity The quantity desired by the user.
   */
  const handleItemQuantityChange = (selectedItem, quantity) => {
    const data = getValues();
    const prevSelectedItems = data.addOns.slice();
    const existingItemIndex = prevSelectedItems.findIndex(
      (item) => item.addOn.name === selectedItem.name
    );

    if (quantity > 0) {
      // Item exists
      if (existingItemIndex >= 0) {
        // Update the quantity of the existing item
        prevSelectedItems[existingItemIndex].quantity = quantity;
      }
      if (existingItemIndex === -1) {
        // Item does not exist, and quantity is greater than 0, so add new item
        prevSelectedItems.push({ addOn: selectedItem, quantity });
      }
    } else {
      // If quantity is less than or equal to 0, remove the item
      prevSelectedItems.splice(existingItemIndex, 1);
    }

    const addOnsTotalCost = prevSelectedItems.reduce(
      (acc, { addOn, quantity }) => acc + addOn.price * quantity,
      0
    );

    setValue("addOnsTotalCost", addOnsTotalCost);

    const dateTimes = {
      startingDateTime: data.startingDateTime,
      endingDateTime: data.endingDateTime,
      effectiveEndingDateTime: data.effectiveEndingDateTime,
    };

    const subtotal = computeSubtotal(
      addOnsTotalCost,
      data.numberOfSeats,
      dateTimes,
      rates,
      setSubTotalBreakDown
    );

    setSubTotal(subtotal);

    setValue("addOns", prevSelectedItems);
    setValue("totalPrice", computeTotal(subtotal, data.discount, data.taxRate));
  };

  useEffect(() => {
    setParams({ pageSize: "All", page: 0 });
  }, [setParams]);

  return (
    <div className="bg-gray-100 containe mx_auto p-2 md:p-10">
      <div className="flex flex-col justify-center items-center">
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-yellow-500 mb-6 md:pt-1 text-center rounded-md md:h-24">
            <h1 className="text-2xl font-bold text-white m-6 pb-1 md:mb-10 md:text-4xl">
              Reservation Form
            </h1>
          </div>
          <div className="font-extrabold font-alata text-xl my-4 py-3 border-b-2 border-gray-600">
            Basic Information
          </div>
          <div>
            <label htmlFor="userId" className="font-bold text-lg">
              User
            </label>
            <br />
            <Controller
              name="userId"
              control={control}
              render={({ field }) => (
                <select
                  className={`${
                    errors.userId ? "rounded-sm border-2 border-red-500" : ""
                  } w-full px-1`}
                  id="userId"
                  {...field}
                >
                  <option value="">Select a user</option>
                  {usersData.map((user) => (
                    <option key={user.userId} value={user.userId}>
                      {`${user.firstName} ${user.lastName}`}
                    </option>
                  ))}
                </select>
              )}
            />{" "}
            {errors.userId && (
              <span className="text-red-500 text-xs">
                {errors.userId.message}
              </span>
            )}
          </div>
          <br />
          <div>
            <label htmlFor="eventType" className="font-bold text-lg">
              Event Type
            </label>
            <br />
            <Controller
              name="eventType"
              control={control}
              render={({ field }) => (
                <select
                  className={`${
                    errors.eventType ? "rounded-sm border-2 border-red-500" : ""
                  } w-full px-1`}
                  id="eventType"
                  {...field}
                >
                  <option value="">Select an event type</option>
                  {primaryServices.map((service) => (
                    <option
                      key={service.id}
                      value={service.title}
                    >{`${service.title}`}</option>
                  ))}
                  <option key={otherService.id} value={otherService.title}>
                    {otherService.title}
                  </option>
                </select>
              )}
            />{" "}
            {errors.eventType && (
              <span className="text-red-500 text-xs">
                {errors.eventType.message}
              </span>
            )}
          </div>
          <br />
          <div>
            <label htmlFor="numberOfSeats" className="font-bold text-lg">
              Guests Count
            </label>
            <br />
            <Controller
              name="numberOfSeats"
              control={control}
              render={({ field }) => (
                <input
                  id="numberOfSeats"
                  type="number"
                  max={200}
                  className={`${
                    errors.numberOfSeats
                      ? "rounded-sm border-2 border-red-500"
                      : ""
                  } w-full px-1`}
                  {...field}
                  onChange={handleGuestCountChange}
                />
              )}
            />{" "}
            {errors.numberOfSeats && (
              <span className="text-red-500 text-xs">
                {errors.numberOfSeats.message}
              </span>
            )}
          </div>
          <br />
          <div>
            <label htmlFor="startingDateTime" className="font-bold text-lg">
              Starting Date and Time
            </label>
            <br />
            <Controller
              name="startingDateTime"
              control={control}
              render={({ field: { onChange, value } }) => (
                <input
                  type="datetime-local"
                  id="startingDateTime"
                  value={value}
                  min={minDateTime}
                  className={`${
                    errors.startingDateTime
                      ? "rounded-sm border-2 border-red-500"
                      : ""
                  } w-full px-1`}
                  onChange={handleStartingDateTimeChange(onChange)}
                />
              )}
            />{" "}
            {errors.startingDateTime && (
              <span className="text-red-500 text-xs">
                {errors.startingDateTime.message}
              </span>
            )}
          </div>
          <br />
          <div>
            <label htmlFor="endingDateTime" className="font-bold text-lg">
              Ending Date and Time
            </label>
            <br />
            <Controller
              name="endingDateTime"
              control={control}
              render={({ field: { onChange, value } }) => (
                <input
                  id="endingDateTime"
                  type="datetime-local"
                  value={value}
                  className={`${
                    errors.endingDateTime
                      ? "rounded-sm border-2 border-red-500"
                      : ""
                  } w-full px-1`}
                  onChange={handleEndingDatetimeChange(onChange)}
                />
              )}
            />{" "}
            {errors.endingDateTime && (
              <span className="text-red-500 text-xs">
                {errors.endingDateTime.message}
              </span>
            )}
          </div>
          <br />

          <div>
            <label
              htmlFor="effectiveEndingDateTime"
              className="font-bold text-lg"
            >
              Effective Ending Date and Time
            </label>
            <br />
            <Controller
              name="effectiveEndingDateTime"
              control={control}
              render={({ field: { onChange, value } }) => (
                <input
                  id="effectiveEndingDateTime"
                  type="datetime-local"
                  value={value}
                  className={`${
                    errors.effectiveEndingDateTime
                      ? "rounded-sm border-2 border-red-500"
                      : ""
                  } w-full px-1`}
                  onChange={handleEffectiveEndingDatetimeChange(onChange)}
                />
              )}
            />{" "}
            {errors.effectiveEndingDateTime && (
              <span className="text-red-500 text-xs">
                {errors.effectiveEndingDateTime.message}
              </span>
            )}
          </div>
          <br />

          <div>
            <label htmlFor="status" className="font-bold text-lg">
              Status
            </label>
            <br />
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <select
                  className={`${
                    errors.status ? "rounded-sm border-2 border-red-500" : ""
                  } w-full px-1`}
                  id="status"
                  {...field}
                >
                  <option value="">Select a status</option>
                  {status.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              )}
            />{" "}
            {errors.status && (
              <span className="text-red-500 text-xs">
                {errors.status.message}
              </span>
            )}
          </div>

          <div className="font-extrabold font-alata text-xl mt-4 py-3 border-b-2 border-gray-600">
            Add-Ons
          </div>

          <AddonsList
            categoryFilters={categoryFilters}
            searchQuery={searchQuery}
            onCategoryFilterChange={handleCategoryFilterChange}
            onSearchQueryChange={handleSearchQueryChange}
            onItemQuantityChange={handleItemQuantityChange}
            requestedAddOns={getValues().addOns ?? []}
            addOnsData={addOnsData.content}
          />
          <br />

          <div>
            <p>
              <i>
                <b>Price Break Down:</b>
              </i>
            </p>
            <br />

            <p id="addOns-totalCost">
              <i>AddOns Total:</i>{" "}
              {USDollar.format(getValues().addOnsTotalCost ?? 0)}
            </p>

            <p>
              <i>Facility Rental:</i>{" "}
              {USDollar.format(subTotalBreakDown.facilityRental)}
            </p>

            <p>
              <i>Cleaning Fees:</i>{" "}
              {USDollar.format(subTotalBreakDown.facilityCleaningFees)}
            </p>

            <p>
              <i>Seats Charge:</i>{" "}
              {USDollar.format(subTotalBreakDown.seats.seatRateTotal)}
              {` (Guest count (${+subTotalBreakDown.seats
                .seatsCount}) * Seat rate (${USDollar.format(
                subTotalBreakDown.seats.seatPrice
              )}))`}
            </p>

            <p>
              <i>Overtime Charge:</i>{" "}
              {USDollar.format(subTotalBreakDown.overtime.totalCost)}
              {` (Overtime (${subTotalBreakDown.overtime.hours.toFixed(
                2
              )} Hours) * Overtime Hourly Rate (${USDollar.format(
                subTotalBreakDown.overtime.overtimeRate
              )}))`}
            </p>
            <br />

            <p className="font-bold text-lg">
              Subtotal: {USDollar.format(subTotal)}
            </p>

            <div className="flex flex-col md:flex-row">
              <label htmlFor="discount" className="font-bold text-lg mr-1">
                Discount:
              </label>
              <div className="flex flex-col">
                <div className="flex flex-row">
                  <Controller
                    name="discount.type"
                    control={control}
                    render={({ field }) => (
                      <select
                        className={`border rounded mx-1 ${
                          errors.discount
                            ? "rounded-sm border-2 border-red-500"
                            : ""
                        } w-full px-1`}
                        id="discount"
                        {...field}
                      >
                        <option value="">Select a discount type</option>
                        {Object.values(Constants.DISCOUNT_TYPES).map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  {discountType === Constants.DISCOUNT_TYPES.Amount && (
                    <div>
                      <Controller
                        name="discount.amount"
                        control={control}
                        render={({ field }) => (
                          <input
                            id="discount"
                            type="number"
                            className={`border rounded mx-1 ${
                              !!errors.discount?.percentage
                                ? "rounded-sm border-2 border-red-500"
                                : ""
                            } w-full px-1`}
                            {...field}
                            onChange={handleDiscountValueChange(field.onChange)}
                          />
                        )}
                      />
                    </div>
                  )}
                  {discountType === Constants.DISCOUNT_TYPES.Percentage && (
                    <>
                      <Controller
                        name="discount.percentage"
                        control={control}
                        render={({ field }) => (
                          <input
                            id="discount"
                            type="number"
                            max={100}
                            className={`border rounded mx-1 ${
                              !!errors.discount?.amount
                                ? "rounded-sm border-2 border-red-500"
                                : ""
                            } w-full px-1`}
                            {...field}
                            onChange={handleDiscountValueChange(field.onChange)}
                          />
                        )}
                      />
                    </>
                  )}
                </div>
                {discountType === Constants.DISCOUNT_TYPES.Amount &&
                  !!errors.discount?.percentage && (
                    <span className="text-red-500 text-xs mx-1">
                      {errors.discount.percentage?.message}
                    </span>
                  )}
                {discountType === Constants.DISCOUNT_TYPES.Percentage &&
                  !!errors.discount?.amount && (
                    <span className="text-red-500 text-xs mx-1">
                      {errors.discount.amount?.message}
                    </span>
                  )}
              </div>
            </div>

            <p className="font-bold text-lg">Taxe: {USDollar.format(taxe)}</p>

            <p className="font-extrabold text-lg">
              Total: {USDollar.format(getValues().totalPrice ?? 0)}
            </p>
          </div>
          <br />

          <div className="flex flex-row justify-between my-8">
            <button
              type="button"
              onClick={resetForm}
              className="w-1/3 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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

ReservationForm.propTypes = {
  reservation: PropTypes.object,
  updateReservation: PropTypes.func,
  usersData: PropTypes.array.isRequired,
  toggleModal: PropTypes.func,
  setState: PropTypes.func,
  isEditing: PropTypes.bool,
};

export default ReservationForm;
