import CustomToast from "../../utils/functions/CustomToast";
import HttpClient from "../../utils/functions/HttpClient";
import ServerEndpoints from "../../utils/constants/ServerEndpoints";
import Errors from "../../utils/constants/Errors";

/**
 * @description Retrieve all receipts from the server
 * @param {Function} setReceipts - Collection of receipts from the server
 */
export const getAllReceipts = async (setReceipts, setIsLoading, params) => {
  await HttpClient.getAxiosClient()
    .get(`${ServerEndpoints.RECEIPT_ENDPOINT}`, { params })
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      }
      if (response.status === 503) {
        CustomToast(Errors.SERVICE_UNAVALAIBLE_ERROR, "error");
        throw new Error(Errors.SERVICE_UNAVALAIBLE_ERROR);
      }
    })
    .then((data) => setReceipts(data))
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
 * @description Retrieve a single receipt from the server
 * @param {Function} setReceipt - The receipt to be retrieved
 * @param {number} id - The receipt's id
 */
export const getReceiptById = async (setReceipt, id) => {
  await HttpClient.getAxiosClient()
    .get(`${ServerEndpoints.RECEIPT_ENDPOINT}/${id}`)
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      }
    })
    .then((data) => setReceipt(data))
    .catch((err) => {
      switch (err.response.status) {
        case 503:
          CustomToast(Errors.SERVICE_UNAVALAIBLE_ERROR, "error");
          throw new Error(Errors.SERVICE_UNAVALAIBLE_ERROR);

        case 400:
          CustomToast("Please review your data and try again.", "error");
          throw new Error("Please review your data and try again.");

        default:
          CustomToast(Errors.API_ERROR, "error");
      }
    });
};

/**
 * @description Create a new receipt
 * @param {Object} receipt - The receipt to be created
 * @param {Function} setState - The function to update the state
 * @param {Function} setApiError - The function to trigger refresh
 * @param {Function} setIsLoading - The function to update the loading state
 */
export const createReceipt = async (
  receipt,
  setState,
  setApiError,
  setIsLoading
) => {
  const requestData = new FormData();
  requestData.append(
    "receipt",
    new Blob([JSON.stringify(receipt)], { type: "application/json" })
  );
  await HttpClient.getAxiosClient()
    .post(`${ServerEndpoints.RECEIPT_ENDPOINT}`, requestData)
    .then((response) => {
      if (response.status === 201) {
        CustomToast("Receipt created successfully", "success");
        setState((prev) => !prev);
        return response.data;
      }
    })
    .then((data) => setApiError(data))
    .catch((err) => {
      switch (err.response.status) {
        case 503:
          CustomToast(Errors.SERVICE_UNAVALAIBLE_ERROR, "error");
          throw new Error(Errors.SERVICE_UNAVALAIBLE_ERROR);

        case 400:
          CustomToast("Please review your data and try again.", "error");
          throw new Error("Please review your data and try again.");

        default:
          CustomToast(Errors.API_ERROR, "error");
      }
    })
    .finally(() => setIsLoading(false));
};

/**
 * @description Email a receipt to a specific email address
 * @param {number} receiptId - The receipt's id
 * @param {Object} email - The email address
 * @param {Function} setApiError - The function to update the state
 * @param {Function} setIsLoading - The function to update the loading state
 * @returns The receipt id
 */
export const emailReceipt = async (
  receiptId,
  email,
  setApiError,
  setIsLoading
) => {
  const requestData = new FormData();
  requestData.append(
    "receiptMailDTO",
    new Blob([JSON.stringify(email)], { type: "application/json" })
  );
  await HttpClient.getAxiosClient()
    .post(`${ServerEndpoints.RECEIPT_ENDPOINT}/${receiptId}/email`, requestData)
    .then((response) => {
      if (response.status === 204) {
        CustomToast("Receipt emailed successfully", "success");
        return response.data;
      }
    })
    .catch((err) => {
      setApiError((prev) => !prev);
      switch (err.response.status) {
        case 503:
          CustomToast(Errors.SERVICE_UNAVALAIBLE_ERROR, "error");
          throw new Error(Errors.SERVICE_UNAVALAIBLE_ERROR);

        case 400:
          CustomToast("Please review your data and try again.", "error");
          throw new Error("Please review your data and try again.");

        default:
          CustomToast(Errors.API_ERROR, "error");
      }
    })
    .finally(() => setIsLoading(false));
};

/**
 * @description Update a receipt
 * @param {Object} receipt - The receipt to be updated
 * @param {Function} setApiError - The function to update the state
 * @param {Function} setIsLoading - The function to update the loading state
 */
export const updateReceipt = async (receipt, setApiError, setIsLoading) => {
  const requestData = new FormData();
  requestData.append(
    "receipt",
    new Blob([JSON.stringify(receipt)], { type: "application/json" })
  );
  await HttpClient.getAxiosClient()
    .put(`${ServerEndpoints.RECEIPT_ENDPOINT}/${receipt.id}`, requestData)
    .then((response) => {
      if (response.status === 200) {
        CustomToast("Receipt updated successfully", "success");
        return response.data;
      }
    })
    .then((data) => setApiError(data))
    .catch((err) => {
      switch (err.response.status) {
        case 503:
          CustomToast(Errors.SERVICE_UNAVALAIBLE_ERROR, "error");
          throw new Error(Errors.SERVICE_UNAVALAIBLE_ERROR);

        case 400:
          CustomToast("Please review your data and try again.", "error");
          throw new Error("Please review your data and try again.");

        default:
          CustomToast(Errors.API_ERROR, "error");
      }
    })
    .finally(() => setIsLoading(false));
};

/**
 * @description Delete a receipt
 * @param {number} id - The receipt's id
 * @param {Function} setIsLoading - The function to update the loading state
 */
export const deleteReceipt = async (id, setIsLoading) => {
  await HttpClient.getAxiosClient()
    .delete(`${ServerEndpoints.RECEIPT_ENDPOINT}/${id}`)
    .then((response) => {
      if (response.status === 200) {
        CustomToast("Receipt deleted successfully", "success");
        return response.data;
      }
    })
    .catch((err) => {
      switch (err.response.status) {
        case 503:
          CustomToast(Errors.SERVICE_UNAVALAIBLE_ERROR, "error");
          throw new Error(Errors.SERVICE_UNAVALAIBLE_ERROR);

        case 400:
          CustomToast("Please review your data and try again.", "error");
          throw new Error("Please review your data and try again.");

        default:
          CustomToast(Errors.API_ERROR, "error");
      }
    })
    .finally(() => setIsLoading(false));
};

/**
 * @description Retrieve all receipts from the server
 * @param {Function} setReceipts - Collection of receipts from the server
 * @param {string} id - The user's id
 * @param {Function} setIsLoading - The function to update the loading state
 * @param {Object} params - The query params
 */
export const getAllReceiptsByUserId = async (
  setReceipts,
  id,
  setIsLoading,
  params
) => {
  await HttpClient.getAxiosClient()
    .get(`${ServerEndpoints.USERS_ENDPOINT}/${id}/receipts`, { params })
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      }
      if (response.status === 503) {
        CustomToast(Errors.SERVICE_UNAVALAIBLE_ERROR, "error");
        throw new Error(Errors.SERVICE_UNAVALAIBLE_ERROR);
      }
    })
    .then((data) => setReceipts(data))
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
 * @description Delete multiple receipts from the server
 * @param {number[]} ids - The receipts' ids
 * @param {Function} setIsLoading - The function to update the loading state
 */

export const deleteReceipts = async (ids, setIsLoading) => {
  const requestData = new FormData();
  requestData.append(
    "receiptIds",
    new Blob([JSON.stringify(ids)], { type: "application/json" })
  );
  await HttpClient.getAxiosClient()
    .delete(`${ServerEndpoints.RECEIPT_ENDPOINT}`, requestData)
    .then((response) => {
      if (response.status === 200) {
        CustomToast("Receipts deleted successfully", "success");
        return response.data;
      }
    })
    .catch((err) => {
      switch (err.response.status) {
        case 503:
          CustomToast(Errors.SERVICE_UNAVALAIBLE_ERROR, "error");
          throw new Error(Errors.SERVICE_UNAVALAIBLE_ERROR);

        case 400:
          CustomToast("Please review your data and try again.", "error");
          throw new Error("Please review your data and try again.");

        default:
          CustomToast(Errors.API_ERROR, "error");
      }
    })
    .finally(() => setIsLoading(false));
};
