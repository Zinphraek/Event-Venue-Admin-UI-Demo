/**
 * This file contains various utility functions used in the application.
 *
 * @module Helpers
 * @fileoverview Utility functions for common operations.
 * @exports capitalize
 * @exports convertKeysToUpperSnakeCase
 * @exports is21YearsOldorOlder
 * @exports formatDate
 * @exports formatDateInput
 * @exports formatDateInput2
 * @exports formatDateTimeForInput
 * @exports formatDateForInput
 * @exports timeOptions
 * @exports isDateInTheFuture
 * @exports isDateInThePast
 * @exports isDateTimeInThePast
 * @exports isTimeBetweenBoundaries
 * @exports isDateAfterDeclaredStartingDate
 * @exports isDateStringValid
 * @exports getDateSting
 * @exports getDate
 * @exports USDollar
 * @exports extractAddOnPrice
 * @exports isValidFileType
 * @exports getNextDayAt3AM
 * @exports computeReservationOvertime
 */
import { SubtotalBreakDown } from "../models/ReservationModel";
import Constants from "../constants/Constants";
import PropTypes from "prop-types";
import Regex from "../constants/Regex";

/**
 * Capitalize a given word.
 * @param {string} word The word to capitalize
 * @returns The capitalized version of word.
 */
export const capitalize = (word) =>
  word.charAt(0).toUpperCase() + word.slice(1);

/**
 * Convert a given object to upper snake case.
 * @param {string} str The string to convert.
 * @returns The string in title case.
 */
export const convertKeysToUpperSnakeCase = (obj) => {
  return Object.keys(obj).reduce((accumulator, key) => {
    const upperSnakeKey = key
      .replace(/([A-Z])/g, "_$1") // Insert a "_" before each uppercase letter
      .toUpperCase(); // Convert the entire string to uppercase
    accumulator[upperSnakeKey] = key;
    return accumulator;
  }, {});
};

/**
 * Check if the given date is 21 years old.
 * @param {Date} date The date to check.
 * @returns True if the given date is 21 years old, false otherwise.
 * @example 2000-01-01 => true
 */
export const is21YearsOldorOlder = (date) => {
  const providedDate = new Date(date);
  const now = new Date();
  const year = now.getFullYear() - 21;
  const month = now.getMonth();
  const day = now.getDate();
  const date21YearsAgo = new Date(year, month, day);
  return date21YearsAgo > providedDate;
};

/**
 * Format a date time to the following as yyyy-MM-dd, hh:mm AM/PM.
 * @param {string} dateToFormat
 * @returns The dateToFormat string formated as yyyy-MM-dd, hh:mm AM/PM.
 */
export const formatDate = (dateToFormat) => {
  const date = new Date(dateToFormat);
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const hour = ("0" + (((date.getHours() + 11) % 12) + 1)).slice(-2);
  const minute = ("0" + date.getMinutes()).slice(-2);
  const ampm = date.getHours() >= 12 ? "PM" : "AM";
  return `${year}-${month}-${day}, ${hour}:${minute} ${ampm}`;
};

/**
 * Format a date time to the following as MM-dd-yyyy.
 * @param {string} dateToFormat
 * @returns The dateToFormat string formated as MM-dd-yyyy.
 * @example 2021-01-01, 12:00 AM => 01-01-2021
 */
export const formatDateInput = (dateToFormat) => {
  const date = new Date(dateToFormat);
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  return `${month}-${day}-${year}`;
};

/**
 * Format a date time to the following as MM/dd/yyyy.
 * @param {string} dateToFormat
 * @returns The dateToFormat string formated as MM/dd/yyyy.
 * @example 2021-01-01, 12:00 AM => 01/01/2021
 */
export const formatDateInput2 = (dateToFormat) => {
  const date = new Date(dateToFormat);
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  return `${month}/${day}/${year}`;
};

/**
 * Format a date time to be used in an input.
 * @param {Date} date The date to format.
 * @returns The date formatted to be used in an input.
 */
export const formatDateTimeForInput = (dateInput) => {
  const date = new Date(dateInput);
  if (!date) {
    return "";
  }
  const year = date.getFullYear().toString().padStart(4, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // months are 0-indexed
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/**
 * Format a date to be used in an input.
 * @param {Date} date The date to format.
 * @returns The date formatted to be used in an input.
 */
export const formatDateForInput = (date) => {
  let d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

export let timeOptions = {
  timeZone: "America/New_York",
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
};

/**
 * Check if the given date is in the future.
 * @param {Date} date The date to check.
 * @returns True if the given date is in the future, false otherwise.
 */
export const isDateInTheFuture = (date) => {
  const now = new Date().toLocaleString("en-US", timeOptions);
  const nowDate = new Date(now);
  const dateToCheck = new Date(
    new Date(date).toLocaleDateString("en-US", timeOptions)
  );
  return dateToCheck > nowDate;
};

/**
 * Check if the given date is in the past.
 * @param {Date} dateInput The date to check.
 * @returns True if the given date is in the past, false otherwise.
 */
export const isDateInThePast = (dateInput) => {
  let dateToCheck;
  let formatedDate = "";
  if (typeof dateInput !== "string") {
    dateToCheck = new Date(dateInput.toLocaleDateString("en-US", timeOptions));
  } else {
    if (Regex.DATE_INPUT.test(dateInput)) {
      const [month, day, year] = dateInput.split("/");
      formatedDate = `${year}-${month}-${day}`;
    } else {
      const [month, day, year] = dateInput.split("-");
      formatedDate = `${year}-${month}-${day}`;
    }
    dateToCheck = new Date(
      new Date(formatedDate).toLocaleDateString("en-US", timeOptions)
    );
  }

  const now = new Date().toLocaleString("en-US", timeOptions);
  const nowDate = new Date(now);
  return dateToCheck < nowDate;
};

/**
 * Check if the given date time is in the past.
 * @param {Date} dateTime The date time to check.
 * @returns True if the given date time is in the past, false otherwise.
 * @example 2021-01-01, 12:00 AM => true
 */
export const isDateTimeInThePast = (dateTime) => {
  const now = new Date().toLocaleString("en-US", timeOptions);
  const nowDate = new Date(now);
  const dateToCheck = new Date(
    new Date(dateTime).toLocaleDateString("en-US", timeOptions)
  );
  return dateToCheck < nowDate;
};

/**
 * Check if the given date time is between two given times boundaries or default to 9:00 AM and 7:30 PM.
 * @param {Date} dateTime The date time to check.
 * @param {object} lowerBoundary The lower boundary.
 * @param {object} upperBoundary The higher boundary.
 * @returns True if the given date time is between the given boundaries or 9:00 AM and 7:30 PM if no boundaries were provided, false otherwise.
 */
export const isTimeBetweenBoundaries = (
  dateTime,
  lowerBoundary,
  upperBoundary
) => {
  // Define start and end times (hours and minutes)
  const startTime = {
    hours: lowerBoundary?.hours ?? 9,
    minutes: lowerBoundary?.minutes ?? 0,
  }; // 9:00
  const endTime = {
    hours: upperBoundary?.hours ?? 19,
    minutes: upperBoundary?.minutes ?? 30,
  }; // 19:30 (7:30 PM)
  const hours = dateTime.getHours();
  const minutes = dateTime.getMinutes();

  // Convert hours and minutes to minutes for easier comparison
  const totalMinutes = hours * 60 + minutes;
  const totalStartMinutes = startTime.hours * 60 + startTime.minutes;
  const totalEndMinutes = endTime.hours * 60 + endTime.minutes;

  // Check if the time falls within the range
  return totalMinutes >= totalStartMinutes && totalMinutes <= totalEndMinutes;
};

/**
 * Check if the given date is before the declared starting date.
 * @param {Date} date The date to check.
 * @param {Date} declaredStartingDate The declared starting date.
 * @returns True if the given date is before the declared starting date, false otherwise.
 */
export const isDateAfterDeclaredStartingDate = (date, declaredStartingDate) => {
  const dateToCheck = new Date(
    new Date(date).toLocaleDateString("en-US", timeOptions)
  );
  const declaredStartingDateToCheck = new Date(
    new Date(declaredStartingDate).toLocaleDateString("en-US", timeOptions)
  );
  return dateToCheck > declaredStartingDateToCheck;
};

/**
 * Check if the given date is valid.
 * @param {Date} date The date to check.
 * @returns True if the given date is valid, false otherwise.
 * @example 2021-01-01 => true
 * @example 2021-01-32 => false
 * @example 2021-13-01 => false
 */
export const isDateStringValid = (date) => {
  const [month, day, year] = date.split("-"); // Reverse the date to be in the correct format
  const formatDate = `${year}-${month}-${day}`;
  const dateToCheck = new Date(formatDate);
  return dateToCheck instanceof Date && !isNaN(dateToCheck);
};

/**
 * Format a date time to the following as yyy/mm/dd.
 * @param {string} dateToFormat
 * @returns The dateToFormat string formated as yyy/mm/dd.
 */
export const getDateSting = (dateToFormat) => {
  const date = new Date(dateToFormat);
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  return `${year}/${month}/${day}`;
};

export const getDate = (dateToFormat) => {
  const date = new Date(dateToFormat).toLocaleDateString("en-US", timeOptions);
  const months = Object.values(Constants.MONTHS);
  const day = String(date.getDate()).padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};

export let USDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

/**
 * Extract the price of a given add-on from a given list of add-ons.
 * @param {Array} addOnList The list of add-ons.
 * @param {string} targetAddOnName The name of the add-on to extract.
 * @returns The price of the given add-on.
 * @example [{itemName: "Chair", itemPrice: 10}, {itemName: "Table", itemPrice: 20}], "Chair" => 10
 */
export const extractAddOnPrice = (addOnList, targetAddOnName) =>
  addOnList.find((addOn) => addOn.name === targetAddOnName)?.price;

/**
 * Fine the next 3:00 AM corresponding date object.
 * @param {object} date The date to get the next day at 3:00 AM
 * @returns The next date object
 */
export const getNextDayAt3AM = (date) => {
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  nextDay.setHours(3);
  nextDay.setMinutes(0);
  nextDay.setSeconds(0);
  nextDay.setMilliseconds(0);
  return nextDay;
};

/**
 *
 * @param {Date} startingDateTime The starting date and time of the reservation.
 * @param {Date} endingDateTime The ending date and time of the reservation.
 * @param {Date} effectiveEndingDateTime The effective ending date and time of the reservation.
 * @returns The overtime in hours.
 */
export const computeReservationOvertime = (
  startingDateTime,
  endingDateTime,
  effectiveEndingDateTime
) => {
  const startingDateAndTime = startingDateTime
    ? new Date(startingDateTime)
    : "";
  const nextDayAt3AM = startingDateTime
    ? getNextDayAt3AM(startingDateTime)
    : "";
  const endingDateAndTime = endingDateTime ? new Date(endingDateTime) : "";
  const effectiveEndingDateAndTime = effectiveEndingDateTime
    ? new Date(effectiveEndingDateTime)
    : "";
  const overtime =
    startingDateAndTime === ""
      ? 0
      : endingDateAndTime === ""
      ? 0
      : endingDateAndTime < nextDayAt3AM
      ? effectiveEndingDateAndTime !== "" &&
        effectiveEndingDateAndTime > nextDayAt3AM
        ? computeOverTimeInHours(nextDayAt3AM, effectiveEndingDateAndTime)
        : 0
      : effectiveEndingDateAndTime !== "" &&
        effectiveEndingDateAndTime > endingDateAndTime
      ? computeOverTimeInHours(nextDayAt3AM, effectiveEndingDateAndTime)
      : effectiveEndingDateAndTime === ""
      ? computeOverTimeInHours(nextDayAt3AM, endingDateAndTime)
      : 0;

  return overtime;
};

/**
 * Compute the overtime in hour unit.
 * @param {object} regularEndingDateTime The regular time at which event end.
 * @param {object} actualEndingDateTime The actual tiem at which the event ended.
 * @returns
 */
export const computeOverTimeInHours = (
  regularEndingDateTime,
  actualEndingDateTime
) => {
  return (
    (actualEndingDateTime.getTime() - regularEndingDateTime.getTime()) /
    (1000 * 60 * 60)
  );
};

/**
 * Compute the subtotal of the reservation.
 * @param {number} addOnsTotal The total cost of all additional items.
 * @param {number} guestCount The total guest count.
 * @param {object} dateTime The starting, ending, and effective ending date-time objects.
 * @param {object} rates All facility rates.
 * @param {Function} setSubtotalBreakDown The price break down updating function.
 * @returns
 */
export const computeSubtotal = (
  addOnsTotal,
  guestCount,
  dateTimes,
  rates,
  setSubtotalBreakDown
) => {
  const seatPrice = rates?.seatRate ?? Constants.SEAT_RATE;
  const startingDateAndTime = dateTimes.startingDateTime
    ? new Date(dateTimes.startingDateTime)
    : "";
  const day =
    startingDateAndTime === ""
      ? ""
      : Constants.WEEK_DAYS[startingDateAndTime.getDay()];

  /*Selecting the rigth facility rate. If the rate are provided through addOns,
     use those rates accordingly, else use the predefined values in the constant object.*/
  const facilityRental =
    !!rates.regularFacilityRate &&
    !!rates.saturdayFacilityRate &&
    !!rates &&
    !!day &&
    day !== Constants.WEEK_DAYS[Constants.WEEK_DAYS.length - 1]
      ? rates.regularFacilityRate
      : rates.saturdayFacilityRate;

  /*Selecting the rigth facility cleaning rate. If the rate are provided through addOns,
     use those rates accordingly, else use the predefined values in the constant object.*/
  const facilityCleaningFees =
    !!rates.cleaningFeesLargeGuestsCount &&
    !!rates &&
    !!rates.cleaningFeesSmallGuestsCount &&
    !!guestCount &&
    guestCount <= 100
      ? rates.cleaningFeesSmallGuestsCount
      : rates.cleaningFeesLargeGuestsCount;

  const overtime = computeReservationOvertime(
    dateTimes.startingDateTime,
    dateTimes.endingDateTime,
    dateTimes.effectiveEndingDateTime
  );

  const overtimeRate = !!rates.overtimeHourlyRate
    ? rates.overtimeHourlyRate
    : Constants.OVERTIME_RATE;

  const subBreakdown = {
    addOnsTotal,
    facilityRental,
    facilityCleaningFees,
    overtime: {
      hours: overtime,
      totalCost: overtime * overtimeRate,
      overtimeRate,
    },
    seats: {
      seatsCount: guestCount,
      seatPrice,
      seatRateTotal: guestCount * seatPrice,
    },
  };

  setSubtotalBreakDown({ ...subBreakdown });

  return (
    +addOnsTotal +
    +guestCount * seatPrice +
    overtime * overtimeRate +
    facilityRental +
    facilityCleaningFees
  );
};

computeSubtotal.propTypes = {
  addOnsTotal: PropTypes.number.isRequired,
  guestCount: PropTypes.number.isRequired,
  dateTimes: PropTypes.object.isRequired,
  rates: PropTypes.object.isRequired,
  setSubtotalBreakDown: PropTypes.func.isRequired,
};

export const isTotalPaymentGreaterThanBalanceDue = (totalPaid, balanceDue) =>
  totalPaid > balanceDue;

/**
 * Convert a string to camel case.
 * @param {string} str The string to convert.
 * @returns The string in camel case.
 */
export const toCamelCase = (str) => {
  return str
    .trim() // Removing any leading or trailing spaces
    .toLowerCase() // Converting the entire string to lowercase
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase()); // Replacing spaces or other non-alphanumeric characters followed by a character with the capitalized character
};

/**
 * Generate the initial subtotal break down.
 * @param {object} reservation The reservation object.
 * @returns The initial subtotal break down.
 */
export const generateInitialSubtotalBreakDown = (reservation) => {
  const initialSubBreakDown = { ...SubtotalBreakDown };
  if (reservation) {
    initialSubBreakDown.facilityCleaningFees = reservation.rates.cleaningRate;
    initialSubBreakDown.facilityRental = reservation.rates.facilityRate;
    initialSubBreakDown.seats.seatPrice = reservation.rates.seatRate;
    initialSubBreakDown.seats.seatsCount = reservation.numberOfSeats;
    initialSubBreakDown.seats.seatRateTotal =
      reservation.rates.seatRate * reservation.numberOfSeats;
    initialSubBreakDown.overtime.overtimeRate = reservation.rates.overtimeRate;
    initialSubBreakDown.overtime.hours = computeReservationOvertime(
      reservation.startingDateTime,
      reservation.endingDateTime,
      reservation.effectiveEndingDateTime
    );
    initialSubBreakDown.overtime.totalCost =
      initialSubBreakDown.overtime.hours * reservation.rates.overtimeRate;
  }
  return initialSubBreakDown;
};

/**
 * Check if the discount is valid.
 * @param {object} discount The discount object.
 * @returns True if the discount is valid, false otherwise.
 */
export const discountShouldNotHavePercentageAndAmount = (discount) =>
  !!discount.amount && !!discount.percentage;

export const isValidFileType = (fileName, fileType) => {
  return (
    fileName &&
    Constants.VALIDFILEEXTENSIONS[fileType].indexOf(fileName.split(".").pop()) >
      -1
  );
};

export const extractFileNameFromBlobName = (blobName, eventId) => {
  // Add the length of the eventId to account for it in the blobName
  const startIndex = eventId.length;
  // Extract the filename between the eventId and the file extension
  const filename = blobName.substring(startIndex);

  // Return the extracted filename
  return filename;
};

export const getFileName = (file) => {
  let fileName = "";
  if (file?.blobName) {
    fileName = extractFileNameFromBlobName(file.blobName, file.eventId);
  } else if (file?.name) {
    fileName = file.name;
  }
  return fileName;
};

export const getFileSize = (file) => {
  let fileSize = "";
  if (file?.size) {
    fileSize = file.size;
  }
  return fileSize;
};

export const getFileType = (file) => {
  let fileType = "";
  if (file?.mediaType) {
    fileType = file.mediaType;
  } else if (file?.type) {
    fileType = file.type;
  }
  return fileType.split("/")[0];
};

export const validateFileSize = (file, setFileSizeError) => {
  const oversizedFiles = [];
  const fileType = getFileType(file).split("/")[0];
  const fileSize = file?.size ?? 10000;
  if (fileSize > Constants.MAX_FILE_SIZE[fileType]) {
    oversizedFiles.push(file);
  }
  const oversizedFilesLength = oversizedFiles.length;
  if (oversizedFilesLength > 0) {
    setFileSizeError(
      `The following ${
        oversizedFilesLength > 1 ? "files are" : "file is"
      } too large: ${oversizedFiles.map((file) => file.name).join(", ")}`
    );
  }
};

export const validateFileTypes = (files, setFileTypeError) => {
  const invalidFiles = [];
  files.forEach((file) => {
    if (!isValidFileType(getFileName(file), getFileType(file))) {
      invalidFiles.push(file);
    }
  });

  const invalidFilesLength = invalidFiles.length;
  if (invalidFilesLength > 0) {
    setFileTypeError(
      `The following ${
        invalidFilesLength > 1 ? "files are" : "file is"
      } not valid: ${invalidFiles.map((file) => file.name).join(", ")}`
    );
  }
};

export const displayFirstAndLastThree = (str) => {
  if (str.length > 6) {
    return str.substring(0, 3) + "..." + str.substring(str.length - 3);
  } else {
    return str;
  }
};
