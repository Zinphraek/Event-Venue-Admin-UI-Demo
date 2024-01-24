import React from "react";
import { getFileName } from "../functions/Helpers";

const FileChip = ({ file, onDelete, mediaType = "addOn" }) => {
  const url = file?.url ?? file?.mediaUrl;
  const fileName =
    mediaType === "addOn" ? file.blobName ?? file.name : getFileName(file);
  // Create a URL for the file
  const fileUrl = file instanceof File ? URL.createObjectURL(file) : url;
  const isVideo =
    file.type?.startsWith("video") ||
    fileUrl.endsWith(".mp4") ||
    file.mediaType?.endsWith("/mp4");

  return (
    <div className="relative bg-gray-800 p-1 pt-6 rounded mr-2 mt-3 mb-1 max-w-22 max-h-20">
      {isVideo ? (
        <video
          src={fileUrl}
          controls
          className="rounded mb-1 w-full h-full"
        ></video>
      ) : (
        <img
          src={fileUrl}
          alt={`Preview of ${fileName}`}
          className="rounded mb-1 w-full h-full"
        />
      )}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-1 bg-black bg-opacity-50 rounded">
        <span className="text-xs text-white truncate">{fileName}</span>
        <button
          onClick={onDelete}
          className="bg-red-500 hover:bg-red-600 text-white font-bold p-1 rounded-full"
          aria-label="Delete file"
        >
          <svg className="w-2 h-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 10.586L16.95 5.636 18.364 7.05 13.414 12l4.95 4.95-1.414 1.414L12 13.414l-4.95 4.95-1.414-1.414L10.586 12 5.636 7.05 7.05 5.636 12 10.586z"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default FileChip;
