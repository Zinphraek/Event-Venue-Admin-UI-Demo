import CustomToast from "../../utils/functions/CustomToast";
import HttpClient from "../../utils/functions/HttpClient";
import ServerEndpoints from "../../utils/constants/ServerEndpoints";
import Errors from "../../utils/constants/Errors";

/**
 * Post a new FAQ to the database.
 * @param {Object} data The FAQ's data to post.
 * @param {Function} setApiError The function to update the error state.
 */
export const createFAQ = async (data, setApiError, setIsLoading) => {
	const requestData = new FormData();
	requestData.append(
		"faq",
		new Blob([JSON.stringify(data)], { type: "application/json" })
	);
	await HttpClient.getAxiosClient()
		.post(`${ServerEndpoints.FAQS_ENDPOINT}`, requestData)
		.then((response) => {
			if (response.status === 201) {
				CustomToast("FAQ created successfully.", "success");
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
 * Update an existing FAQ in the database.
 * @param {object} data The FAQ to update.
 * @param {Function} setApiError The function to update the error state.
 * @param {Function} setState The function to update the state.
 * @param {Function} setIsLoading The function to update the loading state.
 */
export const updateFAQ = async (data, setApiError, setState, setIsLoading) => {
	const requestData = new FormData();
	requestData.append(
		"faq",
		new Blob([JSON.stringify(data)], { type: "application/json" })
	);

	await HttpClient.getAxiosClient()
		.put(`${ServerEndpoints.FAQS_ENDPOINT}/${data.id}`, requestData)
		.then((response) => {
			if (response.status === 200) {
				CustomToast("FAQ updated successfully.", "success");
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
 * Delete an existing FAQ from the database.
 * @param {number} id The FAQ's id to delete.
 * @param {Function} setState The function to update the state.
 * @param {Function} setIsLoading The function to update the loading state.
 */
export const deleteFAQ = async (id, setState, setIsLoading) => {
	await HttpClient.getAxiosClient()
		.delete(`${ServerEndpoints.FAQS_ENDPOINT}/${id}`)
		.then((response) => {
			if (response.status === 200 || response.status === 204) {
				CustomToast("FAQ deleted successfully.", "success");
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
 * Delete multiple FAQs from the database.
 * @param {Array} ids The FAQs' ids to delete.
 * @param {Function} setState The function to update the state.
 * @param {Function} setIsLoading The function to update the loading state.
 */
export const deleteFAQs = async (ids, setState, setIsLoading) => {
	const requestData = new FormData();
	requestData.append(
		"faqIds",
		new Blob([JSON.stringify(ids)], { type: "application/json" })
	);

	await HttpClient.getAxiosClient()
		.delete(`${ServerEndpoints.FAQS_ENDPOINT}`, requestData)
		.then((response) => {
			if (response.status === 200 || response.status === 204) {
				CustomToast("FAQs deleted successfully.", "success");
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
 * Get all FAQs from the database.
 * @param {Function} setState The function to update the state.
 * @param {Function} setIsLoading The function to update the loading state.
 * @param {Object} params The params to filter the FAQs.
 */
export const getAllFAQs = async (setFAQsData, setIsLoading, params) => {
	await HttpClient.getAxiosClient()
		.get(`${ServerEndpoints.FAQS_ENDPOINT}`, { params })
		.then((response) => {
			if (response.status === 200) {
				return response.data;
			}
		})
		.then((data) => {
			setFAQsData(data);
		})
		.catch((err) => {
			switch (err.response.status) {
				case 503:
					CustomToast(Errors.SERVICE_UNAVALAIBLE_ERROR, "error");
					throw new Error(Errors.SERVICE_UNAVALAIBLE_ERROR);

				default:
					CustomToast(Errors.API_ERROR, "error");
			}
		})
		.finally(() => setIsLoading(false));
};
