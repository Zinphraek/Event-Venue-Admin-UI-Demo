import React, { useState } from "react";
import PropTypes from "prop-types";
import { object, string, boolean, number, mixed } from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { isValidFileType } from "../../utils/functions/Helpers";
import { useLoadingSpinner } from "../../utils/components/LoadingSpinnerProvider";
import { createAddOn } from "./AddOnsService";
import { AddOnShape } from "../../utils/models/AddOnModel";
import { Switch } from "@mui/material";
import FileChip from "../../utils/components/FileChip";
import Constants from "../../utils/constants/Constants";

const addOnSchema = object().shape({
  id: number().notRequired(),
  name: string().required("Name is required"),
  category: string().required("Category is required"),
  description: string().required("Description is required"),
  price: number()
    .required("Price is required")
    .positive("Price must be greater than zero"),
  active: boolean().required("Active is required"),
  imageFile: mixed()
    .notRequired()
    .nullable()
    .test("is-valid-type", "Not a valid image type", (value) => {
      if (!!value) {
        if (value.blobName) return true; // Existing file
        isValidFileType(value[0].name.toLowerCase(), "image");
      }
      return true;
    })
    .test("is-valid-size", "Max allowed size is 10MB", (value) => {
      if (!!value) {
        if (value.blobName) return true; // Existing file
        return !value || value[0]?.size <= Constants.MAX_FILE_SIZE.image;
      }
      return true;
    })
    .notRequired(),
});

/**
 * A reusable form component.
 * @param {Object} props Properties
 * @returns
 */
const AddOnForm = (props) => {
  const {
    addOn,
    updateAddOn,
    toggleModal,
    setState,
    isUpdating = false,
  } = props;

  const setIsLoading = useLoadingSpinner();
  const [files, setFiles] = useState(addOn.media ? [addOn.media] : []); // [File]
  const [apiError, setApiError] = useState(false);

  const {
    clearErrors,
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addOnSchema),
    defaultValues: {
      id: addOn?.id ?? "",
      name: addOn?.name ?? "",
      category: addOn?.category ?? "",
      description: addOn?.description ?? "",
      price: addOn?.price ?? 0,
      active: addOn?.active ?? true,
      imageFile: addOn?.media ?? null,
    },
  });

  const handleCancel = () => {
    clearErrors();
    reset({
      id: "",
      name: "",
      category: "",
      description: "",
      price: 0,
      active: true,
      imageFile: null,
    });
    toggleModal(false);
  };

  const onSubmit = async (data) => {
    const updatedAddOn = { ...data };
    let image = null;
    if (files[0] !== addOn.media) {
      image = files[0];
    }
    delete updatedAddOn.imageFile;
    setIsLoading(true);
    if (isUpdating) {
      await updateAddOn(
        updatedAddOn,
        image,
        setState,
        setApiError,
        setIsLoading
      );
    } else {
      await createAddOn(
        updatedAddOn,
        image,
        setState,
        setApiError,
        setIsLoading
      );
    }
    !apiError && handleCancel();
  };

  const fileChangeHandler = (onChange) => (e) => {
    const file = e.target.files;
    if (file.length === 0) {
      onChange(null);
      setFiles([]);
    }
    setFiles(file);
    onChange(file);
  };

  return (
    <div className="bg-gray-100 container mx-auto p-6 md:p-10">
      <div className="flex flex-col justify-center items-center">
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="name" className="text-md font-bold text-gray-600">
              Name
            </label>
            <input
              type="text"
              placeholder="Name..."
              className={`w-full p-2 mb-2 rounded-md border ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              {...register("name")}
            />
            <p className="text-red-500 text-xs">{errors.name?.message}</p>
          </div>
          <br />
          <div>
            <label
              htmlFor="category"
              className="text-md font-bold text-gray-600"
            >
              Category
            </label>

            <input
              type="text"
              placeholder="Facility..."
              className={`w-full p-2 mb-2 rounded-md border ${
                errors.category ? "border-red-500" : "border-gray-300"
              }`}
              {...register("category")}
            />
            <p className="text-red-500 text-xs">{errors.category?.message}</p>
          </div>
          <br />
          <div>
            <label
              htmlFor="imageFile"
              className="text-md font-bold text-gray-600"
            >
              Image
            </label>
            <div
              className={`${
                errors.imageFile ? "rounded-sm border-2 border-red-500" : ""
              } w-full px-1`}
            >
              {/* Existing and new file previews */}
              <div className="mb-4 grid grid-cols-4 gap-2">
                {files.length > 0 && (
                  <FileChip
                    key={`file`}
                    file={files[0]}
                    onDelete={() => setFiles([])}
                  />
                )}
              </div>
              <Controller
                control={control}
                name="imageFile"
                render={({ field }) => (
                  <input
                    type="file"
                    accept="image/*"
                    className={` w-full px-1`}
                    onChange={fileChangeHandler(field.onChange)}
                  />
                )}
              />
            </div>
            <p className="text-red-500 text-xs">{errors.imageFile?.message}</p>
          </div>
          <br />
          <div>
            <label htmlFor="price" className="text-md font-bold text-gray-600">
              Price
            </label>
            <input
              type="number"
              placeholder="Price..."
              className={`w-full p-2 mb-2 rounded-md border ${
                errors.price ? "border-red-500" : "border-gray-300"
              }`}
              {...register("price")}
            />
            <p className="text-red-500 text-xs">{errors.price?.message}</p>
          </div>
          <br />
          <div className="flex flex-row items-baseline justify-between">
            <label
              htmlFor="active"
              className="text-md font-bold text-gray-600 mr-12 md:mr-44"
            >
              Active
            </label>
            <Controller
              control={control}
              name="active"
              defaultValue={true}
              render={({ field }) => (
                <Switch
                  {...field}
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  inputProps={{ "aria-label": "controlled" }}
                  className={`w-full ml-36 p-2 mb-2 rounded-md border ${
                    errors.active ? "border-red-500" : "border-gray-100"
                  }`}
                />
              )}
            />
            <p className="text-red-500 text-xs">{errors.active?.message}</p>
          </div>
          <br />
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="description"
              className="text-md font-bold text-gray-600"
            >
              Description
            </label>
            <br />
            <textarea
              placeholder="Description..."
              className={`w-full p-2 mb-2 rounded-md border ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              rows={3}
              {...register("description")}
            />
            <p className="text-xs text-red-500">
              {errors.description?.message}
            </p>
          </div>
          <div className="flex justify-between my-4">
            <button
              className="w-1/3 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="w-1/3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddOnForm.propTypes = {
  addOn: AddOnShape,
  updateAddOn: PropTypes.func,
  toggleModal: PropTypes.func.isRequired,
  setState: PropTypes.func.isRequired,
  isUpdating: PropTypes.bool,
};

export default AddOnForm;
