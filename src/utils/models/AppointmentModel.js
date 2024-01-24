import PropTypes from "prop-types";

export const AppointmentModel = {
  id: "",
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  dateTime: "",
  raison: "",
  additionalInfo: "",
  status: "",
  userId: "",
};

export const AppointmentShape = {
  id: PropTypes.number,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  phone: PropTypes.string,
  email: PropTypes.string,
  dateTime: PropTypes.string,
  raison: PropTypes.string,
  additionalInfo: PropTypes.string,
  status: PropTypes.string,
};
