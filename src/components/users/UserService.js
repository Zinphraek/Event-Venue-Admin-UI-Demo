import CustomToast from "../../utils/functions/CustomToast";
import HttpClient from "../../utils/functions/HttpClient";
import ServerEndpoints from "../../utils/constants/ServerEndpoints";
import Errors from "../../utils/constants/Errors";

/**
 * Fect all users present in the database.
 * @param {function} setUsersData The function to collect the data provided by the backend.
 * @param {Function} setIsLoading The function to update the loading state.
 * @param {Object} params The parameters to filter the data.
 */
export const getAllUsers = async (setUsersData, setIsLoading, params) => {
  await HttpClient.getAxiosClient()
    .get(`${ServerEndpoints.USERS_ENDPOINT}`, { params })
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      }
    })
    .then((data) => setUsersData(data))
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
 * Retrieve a single user from the database.
 * @param {Function} setUserData The function to collect the fetched data.
 * @param {number} id The appointment's id to fetch.
 * @param {Function} setIsLoading The function to update the loading state.
 */
export const getUserById = async (setUserData, id, setIsLoading) => {
  await HttpClient.getAxiosClient()
    .get(`${ServerEndpoints.USERS_ENDPOINT}/${id}`)
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      }
    })
    .then((data) => setUserData(data))
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
            "The user you are trying to retrieve does not exist in the database.",
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
 * Delete an single user.
 * @param {number} id The targeted addOn identifier.
 * @param {Function} setState The function to update the flag status for the page refresh.
 * @param {Function} setIsLoading The function to update the loading state.
 * @param {Function} setApiError The function to update the api error state.
 */
export const deleteUser = async (id, setState, setIsLoading, setApiError) => {
  await HttpClient.getAxiosClient()
    .delete(`${ServerEndpoints.USERS_ENDPOINT}/${id}`)
    .then((response) => {
      if (response.status === 204) {
        CustomToast("User successfully deleted", "success");
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
            "The user you are trying to delete does not exist in the database.",
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
 * Delete multiple users at once.
 * @param {Array} ids A list of identifiers.
 * @param {Function} setState The function to update the flag status for the page refresh.
 * @param {Function} setIsLoading The function to update the loading state.
 * @param {Function} setApiError The function to update the api error state.
 */
export const deleteUsers = async (ids, setState, setIsLoading, setApiError) => {
  const requestData = new FormData();
  requestData.append(
    "ids",
    new Blob([JSON.stringify(ids)], { type: "application/json" })
  );

  await HttpClient.getAxiosClient()
    .delete(`${ServerEndpoints.USERS_ENDPOINT}`, requestData)
    .then((response) => {
      if (response.status === 204) {
        CustomToast("Users successfully deleted", "success");
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
            "Some of the users you are trying to delete do not exist in the database.",
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
 * Update an user in the database.
 * @param {Object} user The updated information of the targeted user.
 * @param {Function} setIsLoading The function to update the loading state.
 * @param {Function} setState The function to update the flag status for the page refresh.
 * @param {Function} setApiError The function to update the api error state.
 */
export const updateUser = async (user, setIsLoading, setState, setApiError) => {
  const requestData = new FormData();
  requestData.append(
    "user",
    new Blob([JSON.stringify(user)], { type: "application/json" })
  );

  await HttpClient.getAxiosClient()
    .put(`${ServerEndpoints.USERS_ENDPOINT}/${user.userId}`, requestData)
    .then((response) => {
      if (response.status === 200) {
        CustomToast("User successfully updated", "success");
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
            "The user you are trying to update does not exist in the database.",
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
 * Update an user in the database.
 * @param {Object} user The updated information of the targeted user.
 * @param {Function} setIsLoading The function to update the loading state.
 * @param {Function} setState The function to update the flag status for the page refresh.
 * @param {Function} setApiError The function to update the api error state.
 */
export const createUser = async (user, setIsLoading, setState, setApiError) => {
  const requestData = new FormData();
  requestData.append(
    "user",
    new Blob([JSON.stringify(user)], { type: "application/json" })
  );

  await HttpClient.getAxiosClient()
    .post(`${ServerEndpoints.USERS_ENDPOINT}`, requestData)
    .then((response) => {
      if (response.status === 201) {
        CustomToast("User successfully created", "success");
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
          CustomToast("A user with the provided id already exist", "error");
          break;

        default:
          CustomToast(Errors.API_ERROR, "error");
      }
    })
    .finally(() => setIsLoading(false));
};
