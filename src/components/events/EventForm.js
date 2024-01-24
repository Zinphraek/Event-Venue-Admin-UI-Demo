import React, { useState } from "react";
import PropTypes from "prop-types";
import { object, string, boolean } from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  formatDate,
  validateFileSize,
  validateFileTypes,
} from "../../utils/functions/Helpers";
import { useLoadingSpinner } from "../../utils/components/LoadingSpinnerProvider";
import { Switch } from "@mui/material";
import { createEvent } from "./EventServices";
import FileChip from "../../utils/components/FileChip";

const eventSchema = object().shape({
  id: string().notRequired(),
  active: boolean().required("Active is required"),
  title: string().required("Title is required"),
  description: string().required("Description is required"),
});

const EventForm = (props) => {
  const {
    event,
    mediaFiles,
    updateEvent,
    toggleModal,
    setState,
    isUpdating = false,
  } = props;

  const [apiError, setApiError] = useState(false);
  const setIsLoading = useLoadingSpinner();
  const [files, setFiles] = useState(mediaFiles || []);
  const [fileTypeError, setFileTypeError] = useState("");
  const [fileSizeError, setFileSizeError] = useState("");

  const {
    clearErrors,
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(eventSchema),
    defaultValues: {
      id: event?.id ?? "",
      active: event?.active ?? false,
      title: event?.title ?? "",
      description: event?.description ?? "",
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
    const eventData = { ...data };
    if (files.length === 0) {
      setFileTypeError("At least one media file is required");
      return;
    }

    validateFileTypes(files, setFileTypeError);
    validateFileSize(files, setFileSizeError);

    if (fileTypeError || fileSizeError) {
      return;
    }

    if (event.postedDate)
      eventData.postedDate = formatDate(new Date(event.postedDate));

    setIsLoading(true);
    if (isUpdating) {
      await updateEvent(eventData, files, setState, setApiError, setIsLoading);
    } else {
      await createEvent(eventData, files, setState, setApiError, setIsLoading);
    }
    !apiError && handleCancel();
  };

  const handleNewFile = (event) => {
    const fileList = event.target.files;
    setFiles((prevFiles) => [...prevFiles, ...Array.from(fileList)]);
  };

  // Function to remove a file from the list
  const removeFile = (fileToRemove) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
  };

  return (
    <div className="bg-gray-100 container mx-auto p-6 md:p-10">
      <div className="flex flex-col justify-center items-center">
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="title" className="text-md font-bold text-gray-600">
              Title
            </label>
            <input
              type="text"
              placeholder="Title..."
              className={`w-full p-2 mb-2 rounded-md border ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              {...register("title")}
            />
            <p className="text-red-500 text-xs">{errors.title?.message}</p>
          </div>
          <br />
          <div>
            <label
              htmlFor="mediaFiles"
              className="text-md font-bold text-gray-600"
            >
              Media Files
            </label>
            <div>
              {/* Existing and new file previews */}
              <div className="mb-4 grid grid-cols-4 gap-2">
                {files.map((file, index) => (
                  <FileChip
                    key={`file-${index}`}
                    file={file}
                    onDelete={() => removeFile(file)}
                  />
                ))}
              </div>
              {/* File input */}
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleNewFile}
                className="file:bg-blue-500 file:rounded file:border-none file:px-4 file:py-2 file:text-white file:cursor-pointer"
              />
              {fileTypeError && (
                <p className="text-red-500 text-xs">{fileTypeError}</p>
              )}
              {fileSizeError && (
                <p className="text-red-500 text-xs">{fileSizeError}</p>
              )}
            </div>
          </div>
          <br />

          <div className="flex flex-row items-baseline justify-between">
            <label
              htmlFor="active"
              className="text-md font-bold text-gray-600 mr-4 md:mr-36"
            >
              Publish Today
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
                  className={`w-full ml-28 p-2 mb-2 rounded-md border ${
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

EventForm.propTypes = {
  event: PropTypes.object,
  mediaFiles: PropTypes.array,
  updateEvent: PropTypes.func,
  toggleModal: PropTypes.func,
  setState: PropTypes.func,
  isUpdating: PropTypes.bool,
};

export default EventForm;
