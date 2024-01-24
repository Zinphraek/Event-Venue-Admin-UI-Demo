import CustomToast from "../../utils/functions/CustomToast";
import HttpClient from "../../utils/functions/HttpClient";
import ServerEndpoints from "../../utils/constants/ServerEndpoints";
import Errors from "../../utils/constants/Errors";

/**
 * Fect all addOns present in the database.
 * @param {function} setAddOnsData The function to collect the data provided by the backend.
 * @param {Object} params The pagination parameters.
 * @param {function} setState The function to update the flag status for the page refresh.
 * @param {function} setIsLoading The function to update the loading state.
 */
export const getAllAddOns = async (setAddOnsData, params, setIsLoading) => {
  await HttpClient.getAxiosClient()
    .get(`${ServerEndpoints.ADDONS_ENDPOINT}`, { params })
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      }
    })
    .then((data) => setAddOnsData(data))
    .catch((err) => {
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
 * Retrieve a single addOn from the database.
 * @param {Function} setAddOnData The function to collect the fetched data.
 * @param {number} id The addOn's id to fetch.
 * @param {Function} setIsLoading The function to update the loading state.
 */
export const getAddOnById = async (setAddOnData, id, setIsLoading) => {
  await HttpClient.getAxiosClient()
    .get(`${ServerEndpoints.ADDONS_ENDPOINT}/${id}`)
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      }
    })
    .then((data) => setAddOnData(data))
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
            "The addOn you are trying to retrieve does not exist in the database.",
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
 * Delete an single addOn.
 * @param {number} id The targeted addOn identifier.
 * @param {Function} setState The function to update the flag status for the page refresh.
 * @param {Function} setIsLoading The function to update the loading state.
 */
export const deleteAddOn = async (id, setState, setIsLoading) => {
  await HttpClient.getAxiosClient()
    .delete(`${ServerEndpoints.ADDONS_ENDPOINT}/${id}`)
    .then((response) => {
      if (response.status === 204) {
        CustomToast("AddOn successfully deleted", "success");
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
            "The addOn you are trying to delete does not exist in the database.",
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
 * Delete multiple addOns at once.
 * @param {Array} ids A list of identifiers.
 * @param {Function} setState The function to update the flag status for the page refresh.
 * @param {Function} setIsLoading The function to update the loading state.
 */
export const deleteAddOns = async (ids, setState, setIsLoading) => {
  const requestData = new FormData();
  requestData.append("ids", new Blob(ids, { type: "application/json" }));
  await HttpClient.getAxiosClient()
    .delete(`${ServerEndpoints.ADDONS_ENDPOINT}`, requestData)
    .then((response) => {
      if (response.status === 204) {
        CustomToast("AddOns successfully deleted", "success");
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
            "Some of the addOns you are trying to delete do not exist in the database.",
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
 * Update an addOn in the database.
 * @param {Object} addOn The updated information of the targeted addOn.
 * @param {Object} imageFile The addOn's image.
 * @param {Function} setState The function to update the flag status for the page refresh.
 * @param {Function} setApiError The function to update the error flag.
 * @param {Function} setIsLoading The function to update the loading state.
 */
export const updateAddOn = async (
  addOn,
  imageFile,
  setState,
  setApiError,
  setIsLoading
) => {
  const requestData = new FormData();
  requestData.append(
    "addOn",
    new Blob([JSON.stringify(addOn)], { type: "application/json" })
  );
  if (imageFile) {
    requestData.append("imageFile", imageFile);
  }
  await HttpClient.getAxiosClient()
    .put(`${ServerEndpoints.ADDONS_ENDPOINT}/${addOn.id}`, requestData)
    .then((response) => {
      if (response.status === 200) {
        CustomToast("AddOn successfully updated", "success");
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
            "The addOn you are trying to update does not exist in the database.",
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
 * Persit an addOn in the database.
 * @param {Objetc} addOn The addOn's information to create.
 * @param {Object} imageFile The addOn's image.
 * @param {Function} setState The function to update the flag status for the page refresh.
 * @param {Function} setApiError The function to update the error flag.
 * @param {Function} setIsLoading The function to update the loading state.
 */
export const createAddOn = async (
  addOn,
  imageFile,
  setState,
  setApiError,
  setIsLoading
) => {
  const requestData = new FormData();
  requestData.append(
    "addOn",
    new Blob([JSON.stringify(addOn)], { type: "application/json" })
  );
  if (imageFile) {
    requestData.append("imageFile", imageFile);
  }

  await HttpClient.getAxiosClient()
    .post(`${ServerEndpoints.ADDONS_ENDPOINT}`, requestData)
    .then((response) => {
      if (response.status === 201) {
        CustomToast("AddOn successfully created", "success");
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
          CustomToast("An addOn with the provided name already exist", "error");
          break;

        default:
          CustomToast(Errors.API_ERROR, "error");
      }
    })
    .finally(() => setIsLoading(false));
};
