import React from "react";
import PropTypes from "prop-types";
import { USDollar } from "../../utils/functions/Helpers";

const AddOnCard = ({ addOn }) => {
  return (
    <div className="flex flex-col justify-between items-center rounded shadow-md shadow-gray-400 mb-5 w-48 mt-4">
      <div className="w-full">
        <img
          className="w-full h-48 object-cover mb-2.5 rounded-t"
          src={
            addOn.media?.mediaUrl
              ? addOn.media.mediaUrl
              : "image-placeholder-icon.png"
          }
          alt={addOn.name}
        />
      </div>
      <div className="flex flex-col items-center flex-1 w-full mx-auto">
        <h2 className="text-2xl mb-2.5 text-center font-bold">{addOn.name}</h2>
        <p className="text-lg italic font-alata mb-2.5 text-center">
          {addOn.category}
        </p>
        <div className="mb-1 relative mx-2.5">
          <p className="overflow-hidden text-sm text-center transition-max-height ease-out duration-200 pb-2 line-clamp-1">
            {addOn.description}
          </p>
        </div>
        <p className="text-2xl font-bold bg-blue-500 rounded-b text-white m-0 text-center w-full">
          {USDollar.format(addOn.price)}
        </p>
      </div>
    </div>
  );
};

AddOnCard.propTypes = {
  addOn: PropTypes.object.isRequired,
};

export default AddOnCard;
