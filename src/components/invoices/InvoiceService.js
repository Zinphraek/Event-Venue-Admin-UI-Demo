import CustomToast from "../../utils/functions/CustomToast";
import HttpClient from "../../utils/functions/HttpClient";
import ServerEndpoints from "../../utils/constants/ServerEndpoints";
import Errors from "../../utils/constants/Errors";

/**
 * Fetch all invoices present in the database.
 * @param {function} setInvoices The function to collect the data provided by the backend.
 * @param {Function} setIsLoading The function to update the loading state.
 * @param {object} params The params to fetch invoices.
 */
export const getAllInvoices = async (setInvoices, setIsLoading, params) => {
  await HttpClient.getAxiosClient()
    .get(`${ServerEndpoints.INVOICES_ENDPOINT}`, { params })
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      }
      if (response.status === 503) {
        CustomToast(Errors.SERVICE_UNAVALAIBLE_ERROR, "error");
        throw new Error(Errors.SERVICE_UNAVALAIBLE_ERROR);
      }
    })
    .then((data) => setInvoices(data))
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
 * Retrieve a single invoice from the database.
 * @param {Function} setInvoiceData The function to collect the fetched data.
 * @param {number} id The invoice's id to fetch.
 * @param {Function} setIsLoading The function to update the loading state.
 */
export const getInvoiceById = async (setInvoiceData, id, setIsLoading) => {
  await HttpClient.getAxiosClient()
    .get(`${ServerEndpoints.INVOICES_ENDPOINT}/${id}`)
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      }
    })
    .then((data) => setInvoiceData(data))
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
 * Fetch all invoices present in the database by user id.
 * @param {function} setInvoices The function to collect the data provided by the backend.
 * @param {number} id The user's id to fetch invoices.
 * @param {Function} setIsLoading The function to update the loading state.
 */
export const getAllInvoicesByUserId = async (setInvoices, id, setIsLoading) => {
  await HttpClient.getAxiosClient()
    .get(
      `${ServerEndpoints.USERS_ENDPOINT}/${id}${ServerEndpoints.INVOICES_ENDPOINT}`
    )
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      }
      if (response.status === 503) {
        CustomToast(Errors.SERVICE_UNAVALAIBLE_ERROR, "error");
        throw new Error(Errors.SERVICE_UNAVALAIBLE_ERROR);
      }
    })
    .then((data) => setInvoices(data))
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
    .finally(() => {
      setIsLoading(false);
    });
};

/**
 * Create a new invoice in the database.
 * @param {object} invoice The invoice to create.
 * @param {Function} setState The function to update the state.
 * @param {Function} setIsLoading The function to update the loading state.
 */
export const createInvoice = async (invoice, setApiError, setIsLoading) => {
  const requestData = new FormData();
  requestData.append(
    "invoice",
    new Blob([JSON.stringify(invoice)], { type: "application/json" })
  );

  await HttpClient.getAxiosClient()
    .post(`${ServerEndpoints.INVOICES_ENDPOINT}`, requestData)
    .then((response) => {
      if (response.status === 201) {
        CustomToast("Invoice created successfully.", "success");
      }
    })
    .catch((err) => {
      setApiError(true);
      switch (err.response.status) {
        case 503:
          CustomToast(Errors.SERVICE_UNAVALAIBLE_ERROR, "error");
          throw new Error(Errors.SERVICE_UNAVALAIBLE_ERROR);

        case 409:
          CustomToast("Invoice already exists.", "error");
          throw new Error("Invoice already exists.");

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
 * Update an existing invoice in the database.
 * @param {object} invoice The invoice to update.
 * @param {Function} setState The function to update the state.
 * @param {Function} setIsLoading The function to update the loading state.
 */
export const updateInvoice = async (
  invoice,
  setApiError,
  setState,
  setIsLoading
) => {
  const requestData = new FormData();
  requestData.append(
    "invoice",
    new Blob([JSON.stringify(invoice)], { type: "application/json" })
  );

  await HttpClient.getAxiosClient()
    .put(`${ServerEndpoints.INVOICES_ENDPOINT}/${invoice.id}`, requestData)
    .then((response) => {
      if (response.status === 200) {
        CustomToast("Invoice updated successfully.", "success");
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
          throw new Error("Please review your data and try again.");

        default:
          CustomToast(Errors.API_ERROR, "error");
      }
    })
    .finally(() => setIsLoading(false));
};

/**
 * Delete an invoice from the database.
 * @param {number} id The invoice's id to delete.
 * @param {Function} setState The function to update the state.
 * @param {Function} setIsLoading The function to update the loading state.
 */
export const deleteInvoice = async (id, setState, setIsLoading) => {
  await HttpClient.getAxiosClient()
    .delete(`${ServerEndpoints.INVOICES_ENDPOINT}/${id}`)
    .then((response) => {
      if (response.status === 200 || response.status === 204) {
        CustomToast("Invoice deleted successfully.", "success");
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
          throw new Error("Please review your data and try again.");

        default:
          CustomToast(Errors.API_ERROR, "error");
      }
    })
    .finally(() => setIsLoading(false));
};

/**
 * Deleted multiple invoices from the database.
 * @param {Array} ids The invoices ids to cancel.
 * @param {Function} setState The function to update the state.
 * @param {Function} setIsLoading The function to update the loading state.
 */
export const deleteInvoices = async (ids, setState, setIsLoading) => {
  const requestData = new FormData();
  requestData.append(
    "ids",
    new Blob([JSON.stringify(ids)], { type: "application/json" })
  );

  await HttpClient.getAxiosClient()
    .delete(`${ServerEndpoints.INVOICES_ENDPOINT}`, requestData)
    .then((response) => {
      if (response.status === 200) {
        CustomToast("Invoices deleted successfully.", "success");
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
          throw new Error("Please review your data and try again.");

        default:
          CustomToast(Errors.API_ERROR, "error");
      }
    })
    .finally(() => setIsLoading(false));
};
