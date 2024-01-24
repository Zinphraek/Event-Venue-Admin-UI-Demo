import React, { useState } from "react";
import PropTypes from "prop-types";
import Constants from "../../utils/constants/Constants";

const TakeActionForm = (props) => {
  const { handleAction, toggleModal, reservation } = props;
  const [action, setAction] = useState("");
  const allowedActions =
    Constants.STATUS_UPDATE_ALLOWED_ACTIONS[reservation.status];
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <form>
        <div className="mb-4">
          <label
            for="action"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Action
          </label>
          <select
            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="action"
            name="action"
            value={action}
            onChange={(e) => setAction(e.target.value)}
          >
            <option value="">Select an action</option>
            {allowedActions.map((action) => (
              <option
                key={action}
                value={Constants.STATUS_UPDATE_ACTIONS[action]}
              >
                {Constants.STATUS_UPDATE_ACTIONS[action]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="text-white bg-red-500 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-900"
            onClick={() => toggleModal(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            onClick={() => handleAction(action)}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

TakeActionForm.propTypes = {
  handleAction: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
  reservation: PropTypes.object.isRequired,
};

export default TakeActionForm;
