import PropTypes from "prop-types";

export const Media = {
  id: "",
  blobName: "",
  mediaType: "",
  mediaUrl: "",
  size: "",
  type: "",
};

export const AddOnModel = {
  id: "",
  name: "",
  category: "",
  description: "",
  media: Media,
  price: 0,
  active: true,
};

export const AddOnShape = {
  id: PropTypes.number,
  name: PropTypes.string,
  category: PropTypes.string,
  description: PropTypes.string,
  media: PropTypes.shape({
    id: PropTypes.number,
    blobName: PropTypes.string,
    mediaType: PropTypes.string,
    mediaUrl: PropTypes.string,
  }),
  price: PropTypes.number,
  active: PropTypes.bool,
};

export const AddOnKeyName = {
  id: "ID",
  category: "Category",
  name: "Item Name",
  price: "Item Price ($)",
  tools: "Tools",
};

export const RequestedAddOnModel = {
  id: "",
  addOn: AddOnModel,
  quantity: 0,
};
