export default Object.freeze({
  CLEANING_FEES_LARGE_GUESTS_COUNT: 250,
  CLEANING_FEES_SMALL_GUESTS_COUNT: 150,
  CLEANING_FEES_LARGE_GUESTS_COUNT_NAME: "Cleaning Large Guests Count",
  CLEANING_FEES_SMALL_GUESTS_COUNT_NAME: "Cleaning Small Guests Count",
  COMPUTATION_METHOD: ["Auto", "Manual"],
  CATEGORY_FACILITY: "Facility",
  DISCOUNT_TYPES: { Amount: "Amount", Percentage: "Percentage" },
  INVOICE_STATUS: {
    DUE: "Due",
    DUE_IMMEDIATELY: "Due Immediately",
    OVERDUE: "Overdue",
    PAID: "Paid",
    PARTIALLY_PAID: "Partially Paid",
    PENDING: "Pending",
    WITHDWAWN: "Withdrawn",
  },
  ITEMS_PER_PAGE: 6,
  GENDERS: ["Male", "Female", "Non Binary", "Other"],
  MAX_FILE_SIZE: { image: 10 * 1024 * 1024, video: 500 * 1024 * 1024 },
  MONTHS: {
    January: "Jan",
    February: "Feb",
    March: "Mar",
    April: "Apr",
    May: "May",
    June: "Jun",
    July: "Jul",
    August: "Aug",
    September: "Sep",
    October: "Oct",
    November: "Nov",
    December: "Dec",
  },
  OVERTIME_RATE: 150,
  OVERTIME_HOURLY_RATE_NAME: "Overtime Hourly Rate",
  PAYMENT_METHODS: {
    card: "Card",
    cash: "Cash",
    cashApp: "CashApp",
    check: "Check",
    zelle: "Zelle",
    other: "Other",
  },
  REGULAR_DAYS_RATE: 1500,
  REGULAR_FACILITY_RATE_NAME: "Regular Facility Rate",
  SATURDAY_FACILITY_RATE_NAME: "Saturday Facility Rate",
  SATURDAY_RATE: 2000,
  SEAT_RATE: 2.5,
  SEAT_RATE_NAME: "Seat Rate",
  STATUS: {
    Booked: "Booked",
    Cancelled: "Cancelled",
    Done: "Done",
    Pending: "Pending",
    Requested: "Requested",
    Completed: "Completed",
  },
  STATUS_UPDATE_ACTIONS: {
    Cancel: "Cancel",
    Confirm: "Confirm",
    MarkAsDone: "Mark as done",
    RestoreToBooked: "Restore to Booked",
    RestoreToPending: "Restore to Pending",
  },
  STATUS_UPDATE_ALLOWED_ACTIONS: {
    Booked: ["Cancel", "MarkAsDone"],
    Cancelled: ["RestoreToBooked", "RestoreToPending"],
    Completed: ["RestoreToBooked"],
    Pending: ["Confirm", "Cancel", "MarkAsDone"],
    Requested: ["Confirm", "Cancel", "MarkAsDone", "RestoreToBooked"],
    Done: ["RestoreToBooked"],
  },
  STATES: [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
  ],
  TAXE_RATE: 0.07,
  VALIDFILEEXTENSIONS: {
    image: ["jpg", "png", "jpeg"],
    video: ["mp4", "mov"],
  },
  WEEK_DAYS: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
});
