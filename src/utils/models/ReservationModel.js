import Constants from "../constants/Constants";
import { object, string, number, date, array, bool } from "yup";
import {
  isDateAfterDeclaredStartingDate,
  isDateInTheFuture,
  isTimeBetweenBoundaries,
} from "../functions/Helpers";

const discountSchema = object().shape({
  type: string().notRequired(),
  amount: number()
    .transform((value) => (isNaN(value) ? 0 : value))
    .integer()
    .positive()
    .min(0)
    .when("type", {
      is: Constants.DISCOUNT_TYPES.Percentage,
      then: (schema) =>
        schema.test(
          "amount-should-be-zero",
          "Amount should be 0 when discount type is Percentage",
          (value, context) =>
            context.parent.type === Constants.DISCOUNT_TYPES.Percentage
              ? value === 0
              : true
        ),
    }),
  percentage: number()
    .transform((value) => (isNaN(value) ? 0 : value))
    .integer()
    .min(0, "Percentage must be between 0 and 100")
    .max(100, "Percentage must be between 0 and 100")
    .when("type", {
      is: Constants.DISCOUNT_TYPES.Amount,
      then: (schema) =>
        schema.test(
          "percentage-should-be-zero",
          "Percentage should be 0 when discount type is Amount",
          (value, context) =>
            context.parent.type === Constants.DISCOUNT_TYPES.Amount
              ? value === 0
              : true
        ),
    }),
});

export const reservationSchema = object().shape({
  id: number().notRequired(),
  startingDateTime: date()
    .transform((value, originalValue) => {
      return originalValue ? new Date(originalValue) : null;
    })
    .test("is-in-the-future", "Date and time must be in the future", (value) =>
      isDateInTheFuture(value)
    )
    .test("is-between", "Time must be between 9:00 AM and 10:00 PM", (value) =>
      isTimeBetweenBoundaries(
        value,
        { hours: 9, minutes: 0 },
        { hours: 22, minutes: 0 }
      )
    )
    .required("Starting date and time are required"),
  endingDateTime: date()
    .transform((value, originalValue) => {
      return originalValue ? new Date(originalValue) : null;
    })
    .test("is-in-the-future", "Date and time must be in the future", (value) =>
      isDateInTheFuture(value)
    )
    .test(
      "is-after-starting-date",
      "Ending date and time must be after the starting date and time",
      function (value) {
        return isDateAfterDeclaredStartingDate(
          value,
          this.parent.startingDateTime
        );
      }
    )
    .required("Ending date and time are required"),
  effectiveEndingDateTime: date()
    .nullable()
    .notRequired()
    .transform((value, originalValue) =>
      originalValue ? new Date(originalValue) : null
    )
    .test(
      "is-in-the-future",
      "Date and time must be in the future",
      (value) => {
        return value ? isDateInTheFuture(value) : true;
      }
    )
    .test(
      "is-after-starting-date",
      "Effective ending date and time must be after the starting date and time",
      function (value) {
        return value
          ? isDateAfterDeclaredStartingDate(value, this.parent.startingDateTime)
          : true;
      }
    ),
  eventType: string().required("Event type is required"),
  numberOfSeats: number("Guest count must be a number")
    .transform((value) => (isNaN(value) ? 0 : value))
    .integer("Guest count must be an integer")
    .positive("Guest count must be positive number")
    .required("Guest count is required")
    .max(200, "The facility maximum seats capacity is 200"),
  addOns: array().notRequired(),
  addOnsTotalCost: number().required(),
  status: string().required(),
  fullPackage: bool().required(),
  securityDepositRefunded: bool().notRequired(),
  taxRate: number().required(),
  totalPrice: number().required(),
  discount: discountSchema.notRequired(),
  userId: string().required("User is required"),
});

export const defaultDiscount = { amount: 0, percentage: 0, type: "" };

const Rates = {
  cleaningRate: 0,
  facilityRate: 0,
  overtimeRate: 0,
  seatRate: 0,
};

export const ReservationModel = {
  id: "",
  startingDateTime: "",
  endingDateTime: "",
  effectiveEndingDateTime: "",
  eventType: "",
  numberOfSeats: "",
  addOns: [],
  addOnsTotalCost: "",
  status: "Pending",
  fullPackage: false,
  rates: Rates,
  securityDepositRefunded: false,
  taxRate: Constants.TAXE_RATE,
  totalPrice: 0,
  discount: defaultDiscount,
  userId: "",
};

export const ReservKeysName = {
  id: "ID",
  userId: "Users",
  startingDateTime: "Starting Date",
  endingDateTime: "Ending Date",
  effectiveEndingDateTime: "Effective Ending Date",
  eventType: "Event Type",
  numberOfSeats: "Guest Count",
  fullPackage: "Is Full Package",
  securityDepositRefunded: "Refunded Security Deposit",
  status: "Status",
  addOnsTotalCost: "AddOns Total($)",
  taxRate: "Tax Rate",
  totalPrice: "Total Price($)",
  discount: "Applied Discount",
};

export const SubtotalBreakDown = {
  addOnsTotal: 0,
  facilityRental: 0,
  facilityCleaningFees: 0,
  overtime: { hours: 0, totalCost: 0, overtimeRate: 0 },
  seats: { seatRateTotal: 0, seatsCount: 0, seatPrice: 0 },
};
