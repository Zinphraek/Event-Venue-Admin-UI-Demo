import CustomToast from "../../utils/functions/CustomToast";
import HttpClient from "../../utils/functions/HttpClient";
import ServerEndpoints from "../../utils/constants/ServerEndpoints";
import Errors from "../../utils/constants/Errors";

/**
 * Fetch all data from the backend.
 * @param {Object} params The query parameters.
 * @param {Function} setApiError The function to update the api error state.
 * @param {Function} setEventsData The function to collect and set the data from the database.
 * @param {Function} setIsLoading The function to update the loading state.
 */
export const getAllEvents = async (
  params,
  setApiError,
  setEventsData,
  setIsLoading
) => {
  await HttpClient.getAxiosClient()
    .get(`${ServerEndpoints.EVENT_ENDPOINT}`, { params })
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      }
    })
    .then((data) => setEventsData(data))
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
          CustomToast("No records found.", "info");
          break;

        default:
          CustomToast(Errors.API_ERROR, "error");
      }
    })
    .finally(() => setIsLoading(false));
};

/**
 * Retrieve a single event from the database.
 * @param {Function} setEventData The function to collect the fetched data.
 * @param {number} id The event's id to fetch.
 * @param {Function} setIsLoading The function to update the loading state.
 */
export const getEventById = async (setEventData, id, setIsLoading) => {
  await HttpClient.getAxiosClient()
    .get(`${ServerEndpoints.EVENT_ENDPOINT}/${id}`)
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      }
    })
    .then((data) => setEventData(data))
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
            "The event you are trying to retrieve does not exist in the database.",
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
 * Delete an single event.
 * @param {number} id The targeted event identifier.
 * @param {Function} setState The function to update the flag status for the page refresh.
 * @param {Function} setApiError The function to update the api error state.
 * @param {Function} setIsLoading The function to update the loading state.
 */
export const deleteEvent = async (id, setState, setApiError, setIsLoading) => {
  await HttpClient.getAxiosClient()
    .delete(`${ServerEndpoints.EVENT_ENDPOINT}/${id}`)
    .then((response) => {
      if (response.status === 204) {
        CustomToast("Event successfully deleted", "success");
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
            "The evenr you are trying to delete does not exist in the database.",
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
 * Delete multiple events at once.
 * @param {Array} ids A list of identifiers.
 * @param {Function} setState The function to update the flag status for the page refresh.
 * @param {Function} setApiError The function to update the api error state.
 * @param {Function} setIsLoading The function to update the loading state.
 */
export const deleteEvents = async (
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
    .delete(`${ServerEndpoints.EVENT_ENDPOINT}`, requestData)
    .then((response) => {
      if (response.status === 204) {
        CustomToast("Events successfully deleted", "success");
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
            "Some of the events you are trying to delete do not exist in the database.",
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
 * Update an event in the database.
 * @param {Object} event The updated information of the targeted event.
 * @param {Array} media The media files to upload.
 * @param {Function} setState The function to update the flag status for the page refresh.
 * @param {Function} setApiError The function to update the api error state.
 * @param {Function} setIsLoading The function to update the loading state.
 */
export const updateEvent = async (
  event,
  media,
  setState,
  setApiError,
  setIsLoading
) => {
  const requestData = new FormData();
  const arrayOfFiles = media.filter((file) => !file.id && !file.blobName);
  requestData.append(
    "event",
    new Blob([JSON.stringify(event)], { type: "application/json" })
  );

  const retainedMediaIds = media
    .filter((file) => file.id || file.blobName)
    .map((file) => file.id);

  if (retainedMediaIds.length > 0) {
    requestData.append(
      "retainedMediaIds",
      new Blob([JSON.stringify(retainedMediaIds)], { type: "application/json" })
    );
  }

  if (arrayOfFiles.length > 0) {
    arrayOfFiles.forEach((file) => requestData.append("media", file));
  }

  await HttpClient.getAxiosClient()
    .put(`${ServerEndpoints.EVENT_ENDPOINT}/${event.id}`, requestData)
    .then((response) => {
      if (response.status === 200) {
        CustomToast("Event successfully updated", "success");
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
            "The event you are trying to update does not exist in the database.",
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
 * Save an event in the database.
 * @param {Object} event The updated information of the targeted event.
 * @param {Array} media The media files to upload.
 * @param {Function} setState The function to update the flag status for the page refresh.
 * @param {Function} setApiError The function to update the api error state.
 * @param {Function} setIsLoading The function to update the loading state.
 */
export const createEvent = async (
  event,
  media,
  setState,
  setApiError,
  setIsLoading
) => {
  const requestData = new FormData();
  const arrayOfFiles = [...media];
  requestData.append(
    "event",
    new Blob([JSON.stringify(event)], { type: "application/json" })
  );

  arrayOfFiles.forEach((file) => requestData.append("media", file));

  await HttpClient.getAxiosClient()
    .post(`${ServerEndpoints.EVENT_ENDPOINT}`, requestData)
    .then((response) => {
      if (response.status === 201) {
        CustomToast("Event successfully created", "success");
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
          CustomToast("An event with the provided id already exist", "error");
          break;

        default:
          CustomToast(Errors.API_ERROR, "error");
      }
    })
    .finally(() => setIsLoading(false));
};

export const publishEvent = async (
  event,
  setState,
  setApiError,
  setIsLoading
) => {
  const data = new FormData();
  data.append(
    "event",
    new Blob([JSON.stringify(event)], { type: "application/json" })
  );
  await HttpClient.getAxiosClient()
    .put(`${ServerEndpoints.EVENT_ENDPOINT}/${event.id}/publish`, data)
    .then((response) => {
      if (response.status === 200) {
        CustomToast(
          `Event successfully ${event.active ? "published." : "unpublished."}`,
          "success"
        );
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
          CustomToast("An event with the provided id already exist", "error");
          break;

        default:
          CustomToast(Errors.API_ERROR, "error");
      }
    })
    .finally(() => setIsLoading(false));
};

/**
 * Fetch all media related to an event from the backend.
 * @param {Function} setMediaData The function to collect and set the data from the database.
 * @param {number} id The id of the targeted event.
 * @param {Function} setApiError The function to update the api error state.
 * @param {Function} setIsLoading The function to update the loading state.
 * @returns The media data.
 * @throws {Error} The error message.
 */
export const getMediaByEventId = async (
  setMediaData,
  id,
  setApiError,
  setIsLoading
) => {
  await HttpClient.getAxiosClient()
    .get(`${ServerEndpoints.EVENT_ENDPOINT}/${id}/media`)
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      }
    })
    .then((data) => {
      setMediaData(data);
    })
    .catch((err) => {
      setApiError(true);
      switch (err.response.status) {
        case 503:
          CustomToast(Errors.SERVICE_UNAVALAIBLE_ERROR, "error");
          break;

        case 400:
          CustomToast("Please review your data and try again.", "error");
          break;

        case 404:
          CustomToast(
            "The media you are trying to retrieve does not exist in the database.",
            "error"
          );
          break;

        default:
          CustomToast(Errors.API_ERROR, "error");
      }
    })
    .finally(() => setIsLoading(false));
};
