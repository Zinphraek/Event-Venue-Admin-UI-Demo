import React from "react";
import PropTypes from "prop-types";

/**
 * A custom multiple select component.
 * @param {Array} options The list of options to display.
 * @param {Function} toggleOption The function to call when an option is selected.
 * @param {Array} selectedOptions The list of selected options.
 * @returns The custom multiple select component.
 */
const MultipleSelect = ({ options, toggleOption, selectedOptions }) => {
  return (
    <div
      className="border rounded p-2 max-w-xs flex flex-wrap bg-gray-300 w-full"
      style={{ overflowY: "auto" }}
    >
      {options.map((option) => (
        <div
          key={option.value}
          className={`p-2 m-1 rounded cursor-pointer ${
            selectedOptions.includes(option.value)
              ? "bg-blue-500"
              : "bg-gray-200"
          }`}
          onClick={() => toggleOption(option.value)}
        >
          {option.label}
        </div>
      ))}
    </div>
  );
};

MultipleSelect.types = {
  options: PropTypes.array.isRequired,
  toggleOption: PropTypes.func.isRequired,
  selectedOptions: PropTypes.array.isRequired,
};

export default MultipleSelect;
