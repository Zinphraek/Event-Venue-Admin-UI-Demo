import CustomToast from "../../utils/functions/CustomToast";
import HttpClient from "../../utils/functions/HttpClient";
import ServerEndpoints from "../../utils/constants/ServerEndpoints";
import Errors from "../../utils/constants/Errors";

/**
 * Fect all reservations present in the database.
 * @param {Object} params The parameters to filter the data.
 * @param {function} setReservationsData The function to collect the data provided by the backend.
 * @param {function} setApiError The function to set error flag
 * @param {function} setIsLoading The function to update the loading state.
 */
export const getAllReservations = async (
  params,
  setReservationsData,
  setApiError,
  setIsLoading
) => {
  await HttpClient.getAxiosClient()
    .get(`${ServerEndpoints.RESERVATIONS_ENDPOINT}`, { params })
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      }
      if (response.status === 503) {
        CustomToast(Errors.SERVICE_UNAVALAIBLE_ERROR, "error");
        throw new Error(Errors.SERVICE_UNAVALAIBLE_ERROR);
      }
    })
    .then((data) => setReservationsData(data))
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
 * Retrieve a single reservation from the database.
 * @param {Function} setReservationData The function to collect the fetched data.
 * @param {number} id The appointment's id to fetch.
 * @param {Function} setApiError The error flag setter.
 * @param {Function} setIsLoading The function to update the loading state.
 */
export const getReservationById = async (
  setReservationData,
  id,
  setApiError,
  setIsLoading
) => {
  await HttpClient.getAxiosClient()
    .get(`${ServerEndpoints.RESERVATIONS_ENDPOINT}/${id}`)
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      }
    })
    .then((data) => setReservationData(data))
    .catch((err) => {
      setApiError(true);
      switch (err.response.status) {
        case 503:
          CustomToast(Errors.SERVICE_UNAVALAIBLE_ERROR, "error");
          throw new Error(Errors.SERVICE_UNAVALAIBLE_ERROR);

        case 400:
          CustomToast("Please review your data and try again.", "error");
          throw new Error("Please review your data and try again.");

        case 404:
          CustomToast(
            "The reservation you are trying to retrieve does not exist in the database.",
            "error"
          );
          throw new Error(
            "The reservation you are trying to retrieve does not exist in the database."
          );

        default:
          CustomToast(Errors.API_ERROR, "error");
      }
    })
    .finally(() => setIsLoading(false));
};

/**
 * This function is used to retrieve all the reservations linked to a specific user.
 * @param {Function} setReservationData The function to collect the fetched data.
 * @param {String} id The user's id to whose the reservations are linked.
 * @param {Function} setApiError The error flag setter.
 * @param {Function} setIsLoading The function to update the loading state.
 */
export const getReservationByUserId = async (
  setReservationData,
  id,
  setApiError,
  setIsLoading
) => {
  await HttpClient.getAxiosClient()
    .get(
      `${ServerEndpoints.USERS_ENDPOINT}/${id}${ServerEndpoints.RESERVATIONS_ENDPOINT}`
    )
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      }
    })
    .then((data) => setReservationData(data))
    .catch((err) => {
      setApiError(true);
      switch (err.response.status) {
        case 503:
          CustomToast(Errors.SERVICE_UNAVALAIBLE_ERROR, "error");
          throw new Error(Errors.SERVICE_UNAVALAIBLE_ERROR);
        case 400:
          CustomToast("Please review your data and try again.", "error");
          throw new Error("Please review your data and try again.");
        case 404:
          CustomToast(
            "The reservation you are trying to retrieve does not exist in the database.",
            "error"
          );
          throw new Error(
            "The reservation you are trying to retrieve does not exist in the database."
          );
        default:
          CustomToast(Errors.API_ERROR, "error");
      }
    })
    .finally(() => setIsLoading(false));
};

/**
 * Cancel an single reservation.
 * @param {number} id The targeted addOn identifier.
 * @param {Function} setState The function to update the flag status for the page refresh.
 * @param {Function} setApiError The error flag setter.
 * @param {Function} setIsLoading The function to update the loading state.
 */
export const cancelReservation = async (
  id,
  setState,
  setApiError,
  setIsLoading
) => {
  await HttpClient.getAxiosClient()
    .delete(`${ServerEndpoints.RESERVATIONS_ENDPOINT}/${id}`)
    .then((response) => {
      if (response.status === 204) {
        CustomToast("Reservation successfully deleted", "success");
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
            "The reservation you are trying to delete does not exist in the database.",
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
 * Cancel multiple reservations at once.
 * @param {Array} ids A list of identifiers.
 * @param {Function} setState The function to update the flag status for the page refresh.
 * @param {Function} setApiError The error flag setter.
 * @param {Function} setIsLoading The function to update the loading state.
 */
export const cancelReservations = async (
  ids,
  setState,
  setApiError,
  setIsLoading
) => {
  const requestData = new FormData();
  requestData.append(
    "ids",
    new Blob([JSON.stringify(ids)], { type: "application/json" })
  );

  await HttpClient.getAxiosClient()
    .delete(`${ServerEndpoints.RESERVATIONS_ENDPOINT}`, requestData)
    .then((response) => {
      if (response.status === 204) {
        CustomToast("Reservations successfully deleted", "success");
        setState((prev) => !prev);
      }
    })
    .catch((err) => {
      setApiError(true);
      switch (err.response.status) {
        case 400:
          CustomToast("Please review your data and try again.", "error");
          break;

        case 404:
          CustomToast(
            "Some of the reservations you are trying to delete do not exist in the database.",
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
 * Update an reservation in the database.
 * @param {Object} reservation The updated information of the addOn the targeted addOn.
 * @param {Function} setState The flag setter to signal data update.
 * @param {Function} setApiError The error flag setter.
 * @param {Function} setIsLoading The function to update the loading state.
 */
export const updateReservation = async (
  reservation,
  setState,
  setApiError,
  setIsLoading
) => {
  const requestData = new FormData();
  requestData.append(
    "reservation",
    new Blob([JSON.stringify(reservation)], { type: "application/json" })
  );

  await HttpClient.getAxiosClient()
    .put(
      `${ServerEndpoints.USERS_ENDPOINT}/${reservation.userId}${ServerEndpoints.RESERVATIONS_ENDPOINT}/${reservation.id}`,
      requestData
    )
    .then((response) => {
      if (response.status === 200) {
        CustomToast("Reservation successfully updated", "success");
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
            "The reservation you are trying to update does not exist in the database.",
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
 * Update an reservation in the database.
 * @param {Object} reservation The updated information of the targeted reservation.
 * @param {Function} setState The flag setter to signal data update.
 * @param {Function} setApiError The error flag setter.
 * @param {Function} setIsLoading The function to update the loading state.
 */
export const createReservation = async (
  reservation,
  setState,
  setApiError,
  setIsLoading
) => {
  const requestData = new FormData();
  requestData.append(
    "reservation",
    new Blob([JSON.stringify(reservation)], { type: "application/json" })
  );

  await HttpClient.getAxiosClient()
    .post(`${ServerEndpoints.RESERVATIONS_ENDPOINT}`, requestData)
    .then((response) => {
      if (response.status === 201) {
        CustomToast("Reservation successfully created", "success");
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
            "A reservation with the provided id already exist",
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
 * Update a reservation status in the database based on the action taken.
 * @param {number} id The targeted reservation's id.
 * @param {string} userId The user's id to whom the reservation is linked.
 * @param {string} action The action taken.
 * @param {Function} setState The flag setter to signal data update.
 * @param {Function} setApiError The error flag setter.
 * @param {Function} setIsLoading The function to update the loading state.
 */
export const updateReservationStatus = async (
  id,
  userId,
  action,
  setState,
  setApiError,
  setIsLoading
) => {
  const requestData = new FormData();
  requestData.append("action", action);

  await HttpClient.getAxiosClient()
    .put(
      `${ServerEndpoints.USERS_ENDPOINT}/${userId}${ServerEndpoints.RESERVATIONS_ENDPOINT}/action/${id}`,
      requestData
    )
    .then((response) => {
      if (response.status === 204) {
        CustomToast("Reservation successfully updated", "success");
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
            "The reservation you are trying to update does not exist in the database.",
            "error"
          );
          break;

        default:
          CustomToast(Errors.API_ERROR, "error");
      }
    })
    .finally(() => setIsLoading(false));
};
