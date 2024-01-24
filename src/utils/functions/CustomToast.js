import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

/**
 * Generate a custom toast with the desired message.
 * @param {String} message The message to display.
 * @param {String} toastType The toast type ('error', 'info', 'success', 'warn').
 * 'warn' is short for warning.
 */
const CustomToast = (message, toastType = null) => {
  const toastParameters = {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
    progress: undefined,
  };

  if (toastType) {
    toast[toastType](message, toastParameters);
  } else {
    toast(message, toastParameters);
  }
};

export default CustomToast;
