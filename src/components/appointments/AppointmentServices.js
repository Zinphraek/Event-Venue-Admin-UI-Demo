import CustomToast from "../../utils/functions/CustomToast";
import HttpClient from "../../utils/functions/HttpClient";
import ServerEndpoints from "../../utils/constants/ServerEndpoints";
import Errors from "../../utils/constants/Errors";

/**
 * Fetch all data from the backend.
 * @param {Function} setAppointmentsData The function to collect and set the data from the database.
 * @param {Object} params The parameters to filter the data.
 * @param {Function} setApiError The function to update the api error state.
 * @param {Function} setIsLoading The function to update the loading state.
 */
export const getAllAppointments = async (
  setAppointmentsData,
  params,
  setApiError,
  setIsLoading
) => {
  await HttpClient.getAxiosClient()
    .get(`${ServerEndpoints.APPOINTMENTS_ENDPOINT}`, { params })
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      }
    })
    .then((data) => setAppointmentsData(data))
    .catch((err) => {
      setApiError(true);
      switch (err.response.status) {
        case 503:
          CustomToast(Errors.SERVICE_UNAVALAIBLE_ERROR, "error");
          throw new Error(Errors.SERVICE_UNAVALAIBLE_ERROR);

        case 400:
          CustomToast("Please review your data and try again.", "error");
          break;

        default:
          CustomToast(Errors.API_ERROR, "error");
      }
    })
    .finally(() => setIsLoading(false));
};

/**
 * Retrieve a single appointment from the database.
 * @param {Function} setAppointmentData The function to collect the fetched data.
 * @param {number} id The appointment's id to fetch.
 * @param {Function} setIsLoading The function to update the loading state.
 */
export const getAppointmentById = async (
  setAppointmentData,
  id,
  setIsLoading
) => {
  await HttpClient.getAxiosClient()
    .get(`${ServerEndpoints.APPOINTMENTS_ENDPOINT}/${id}`)
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      }
    })
    .then((data) => setAppointmentData(data))
    .catch((err) => {
      switch (err.response.status) {
        case 503:
          CustomToast(Errors.SERVICE_UNAVALAIBLE_ERROR, "error");
          throw new Error(Errors.SERVICE_UNAVALAIBLE_ERROR);

        case 400:
          CustomToast("Please review your data and try again.", "error");
          break;

        case 404:
          CustomToast(
            "The appointment you are trying to retrieve does not exist in the database.",
            "error"
          );
          break;

        default:
          CustomToast(Errors.API_ERROR, "error");
      }
    })
    .finally(() => setIsLoading(false));
};

/**
 * Delete an single appointment.
 * @param {number} id The targeted appointment identifier.
 * @param {Function} setState The function to update the flag status for the page refresh.
 * @param {Function} setIsLoading The function to update the loading state.
 */
export const deleteAppointment = async (id, setState, setIsLoading) => {
  await HttpClient.getAxiosClient()
    .delete(`${ServerEndpoints.APPOINTMENTS_ENDPOINT}/${id}`)
    .then((response) => {
      if (response.status === 204) {
        CustomToast("Appointment successfully deleted", "success");
        setState((prev) => !prev);
      }
    })
    .catch((err) => {
      switch (err.response.status) {
        case 503:
          CustomToast(Errors.SERVICE_UNAVALAIBLE_ERROR, "error");
          throw new Error(Errors.SERVICE_UNAVALAIBLE_ERROR);

        case 400:
          CustomToast("Please review your data and try again.", "error");
          break;

        case 404:
          CustomToast(
            "The appointment you are trying to delete does not exist in the database.",
            "error"
          );
          break;

        default:
          CustomToast(Errors.API_ERROR, "error");
      }
    })
    .finally(() => setIsLoading(false));
};

/**
 * Delete multiple appointments at once.
 * @param {Array} ids A list of identifiers.
 * @param {Function} setState The function to update the flag status for the page refresh.
 * @param {Function} setIsLoading The function to update the loading state.
 */
export const deleteAppointments = async (ids, setState, setIsLoading) => {
  const requestData = new FormData();
  requestData.append(
    "ids",
    new Blob([JSON.stringify(ids)], { type: "application/json" })
  );

  await HttpClient.getAxiosClient()
    .delete(`${ServerEndpoints.APPOINTMENTS_ENDPOINT}`, requestData)
    .then((response) => {
      if (response.status === 204) {
        CustomToast("Appointment successfully deleted", "success");
        setState((prev) => !prev);
      }
    })
    .catch((err) => {
      switch (err.response.status) {
        case 400:
          CustomToast("Please review your data and try again.", "error");
          break;

        case 404:
          CustomToast(
            "Some of the appointments you are trying to delete do not exist in the database.",
            "error"
          );
          break;

        case 503:
          CustomToast(Errors.SERVICE_UNAVALAIBLE_ERROR, "error");
          throw new Error(Errors.SERVICE_UNAVALAIBLE_ERROR);

        default:
          CustomToast(Errors.API_ERROR, "error");
      }
    })
    .finally(() => setIsLoading(false));
};

/**
 * Cancel an appointment.
 * @param {number} id The targeted appointment identifier.
 * @param {Function} setState The function to update the flag status for the page refresh.
 * @param {Function} setApiError The function to update the api error state.
 * @param {Function} setIsLoading The function to update the loading state.
 */
export const cancelAppointment = async (
  id,
  setState,
  setApiError,
  setIsLoading
) => {
  await HttpClient.getAxiosClient()
    .delete(`${ServerEndpoints.APPOINTMENTS_ENDPOINT}/cancel/${id}`)
    .then((response) => {
      if (response.status === 204) {
        CustomToast("Appointment successfully canceled", "success");
        setState((prev) => !prev);
      }
    })
    .catch((err) => {
      setApiError(true);
      switch (err.response.status) {
        case 503:
          CustomToast(Errors.SERVICE_UNAVALAIBLE_ERROR, "error");
          throw new Error(Errors.SERVICE_UNAVALAIBLE_ERROR);
        case 400:
          CustomToast("Please review your data and try again.", "error");
          break;

        case 404:
          CustomToast(
            "The appointment you are trying to cancel does not exist in the database.",
            "error"
          );
          break;

        default:
          CustomToast(Errors.API_ERROR, "error");
      }
    })
    .finally(() => setIsLoading(false));
};

/**
 * Restore an appointment.
 * @param {number} id The targeted appointment identifier.
 * @param {Function} setState The function to update the flag status for the page refresh.
 * @param {Function} setApiError The function to update the api error state.
 * @param {Function} setIsLoading The function to update the loading state.
 */
export const restoreAppointment = async (
  id,
  setState,
  setApiError,
  setIsLoading
) => {
  await HttpClient.getAxiosClient()
    .put(`${ServerEndpoints.APPOINTMENTS_ENDPOINT}/restore/${id}`)
    .then((response) => {
      if (response.status === 200) {
        CustomToast("Appointment successfully restored", "success");
        setState((prev) => !prev);
      }
    })
    .catch((err) => {
      setApiError(true);
      switch (err.response.status) {
        case 503:
          CustomToast(Errors.SERVICE_UNAVALAIBLE_ERROR, "error");
          throw new Error(Errors.SERVICE_UNAVALAIBLE_ERROR);

        case 409:
          CustomToast(
            "The appointment time frame is no longer available.",
            "error"
          );
          break;

        case 404:
          CustomToast(
            "The appointment you are trying to restore does not exist in the database.",
            "error"
          );
          break;

        case 400:
          CustomToast("Please review your data and try again.", "error");
          break;

        default:
          CustomToast(Errors.API_ERROR, "error");
      }
    })
    .finally(() => setIsLoading(false));
};

/**
 * Update an appointment in the database.
 * @param {Object} appointment The updated information of the targeted appoitment.
 * @param {Function} setApiError The function to update the api error state.
 * @param {Function} setState The function to update the flag status for the page refresh.
 * @param {Function} setIsLoading The function to update the loading state.
 */
export const updateAppointment = async (
  appointment,
  setApiError,
  setState,
  setIsLoading
) => {
  const requestData = new FormData();
  requestData.append(
    "appointment",
    new Blob([JSON.stringify(appointment)], { type: "application/json" })
  );

  await HttpClient.getAxiosClient()
    .put(
      `${ServerEndpoints.APPOINTMENTS_ENDPOINT}/${appointment.id}`,
      requestData
    )
    .then((response) => {
      if (response.status === 200) {
        CustomToast("Appointment successfully updated", "success");
        setState((prev) => !prev);
      }
    })
    .catch((err) => {
      setApiError(true);
      switch (err.response.status) {
        case 503:
          CustomToast(Errors.SERVICE_UNAVALAIBLE_ERROR, "error");
          throw new Error(Errors.SERVICE_UNAVALAIBLE_ERROR);

        case 400:
          CustomToast("Please review your data and try again.", "error");
          break;

        case 404:
          CustomToast(
            "The appointment you are trying to update does not exist in the database.",
            "error"
          );
          break;

        default:
          CustomToast(Errors.API_ERROR, "error");
      }
    })
    .finally(() => setIsLoading(false));
};

/**
 * Update an appointment in the database.
 * @param {Object} appointment The updated information of the targeted appointment.
 * @param {Function} setApiError The function to update the api error state.
 * @param {Function} setState The function to update the flag status for the page refresh.
 * @param {Function} setIsLoading The function to update the loading state.
 */
export const createAppointment = async (
  appointment,
  setApiError,
  setState,
  setIsLoading
) => {
  const requestData = new FormData();
  requestData.append(
    "appointment",
    new Blob([JSON.stringify(appointment)], { type: "application/json" })
  );

  await HttpClient.getAxiosClient()
    .post(`${ServerEndpoints.APPOINTMENTS_ENDPOINT}`, requestData)
    .then((response) => {
      if (response.status === 201) {
        CustomToast("Appointment successfully created", "success");
        setState((prev) => !prev);
      }
    })
    .catch((err) => {
      setApiError(true);
      switch (err.response.status) {
        case 503:
          CustomToast(Errors.SERVICE_UNAVALAIBLE_ERROR, "error");
          throw new Error(Errors.SERVICE_UNAVALAIBLE_ERROR);

        case 400:
          CustomToast("Please review your data and try again.", "error");
          break;

        case 409:
          CustomToast(
            "An appointment with the provided id already exist",
            "error"
          );
          break;

        default:
          CustomToast(Errors.API_ERROR, "error");
      }
    })
    .finally(() => setIsLoading(false));
};
