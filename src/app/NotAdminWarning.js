import React from "react";
import PagesEndPoint from "../utils/constants/PagesEndPoint";
import { MinusCircleIcon } from "@heroicons/react/24/outline";

const NotAdminWarning = () => {
  const navigateTo = () => {
    window.location.href = PagesEndPoint.FRONT_END_HOME_PAGE_URL;
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="flex flex-row text-lg font-semibold text-gray-800">
          <MinusCircleIcon
            className="h-8 w-8 mr-1 text-red-800"
            aria-hidden="true"
          />
          Access Denied
        </h1>
        <p className="mt-2 text-gray-600">
          Sorry, you do not have the necessary permissions to access this page.
        </p>
        <div className="mt-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => navigateTo(PagesEndPoint.FRONT_END_HOME_PAGE_URL)}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotAdminWarning;
