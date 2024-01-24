import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { EventModel } from "../../utils/models/EventModel";
import {
  getAllEvents,
  deleteEvents,
  deleteEvent,
  publishEvent,
  updateEvent,
  getMediaByEventId,
} from "./EventServices";
import { EntitiesListResponseModel } from "../../utils/models/EntitiesListResponseModel";
import { useLoadingSpinner } from "../../utils/components/LoadingSpinnerProvider";
import { Button, Container, Switch } from "@mui/material";
import CustomDataTable from "../../utils/components/CustomDataTable";
import Modal from "../../utils/components/Modal";
import Cancellation from "../../utils/components/Cancellation";
import EventForm from "./EventForm";
import {
  displayFirstAndLastThree,
  formatDate,
} from "../../utils/functions/Helpers";

const Events = () => {
  const [eventsData, setEventsData] = useState(EntitiesListResponseModel);
  const [showDeletionModal, setShowDeletionModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showCreationModal, setShowCreationModal] = useState(false);
  const [showEditionModal, setShowEditionModal] = useState(false);
  const [params, setParams] = useState({ pageSize: 10, page: 0 });
  const [eventMedia, setEventMedia] = useState([]);
  const [apiError, setApiError] = useState(false);
  const [event, setEvent] = useState(EventModel);
  const [state, setState] = useState(false);
  const setIsLoading = useLoadingSpinner();
  const [ids, setIds] = useState([]);

  const lunchEditionModal = async (eventRow) => {
    setEvent(eventRow);
    await getMediaByEventId(
      setEventMedia,
      eventRow.id,
      setApiError,
      setIsLoading
    );
    setShowEditionModal(true);
  };

  const lunchDeletionModal = (selectedIds) => {
    setIds(selectedIds);
    setShowDeletionModal(true);
  };

  const lunchPublishModal = (selectedEvent) => {
    const updateEvent = {
      ...selectedEvent,
      active: !selectedEvent.active,
      postedDate: !selectedEvent.active
        ? formatDate(new Date())
        : selectedEvent.postedDate,
    };
    setEvent(updateEvent);
    setShowPublishModal(true);
  };

  const handlePublish = async () => {
    setIsLoading(true);
    await publishEvent(event, setState, setApiError, setIsLoading);
    !apiError && setShowPublishModal(false);
  };

  const headerColumnsArray = [
    {
      field: "id",
      headerName: "ID",
      width: 90,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => lunchEditionModal(params.row)}
        >
          {displayFirstAndLastThree(params.value)}
        </Button>
      ),
    },
    {
      field: "title",
      headerName: "Title",
      width: 300,
    },
    {
      field: "description",
      headerName: "Description",
      width: 350,
    },
    {
      field: "likesDislikes",
      headerName: "Likes",
      type: "number",
      width: 100,
      renderCell: (params) => (
        <span>{params.row?.likesDislikes?.likes ?? 0}</span>
      ),
    },
    {
      field: "dislikes",
      headerName: "Dislikes",
      type: "number",
      width: 100,
      renderCell: (params) => (
        <span>{params.row?.likesDislikes?.dislikes ?? 0}</span>
      ),
    },
    {
      field: "commentsCount",
      headerName: "Comments",
      type: "number",
      width: 110,
    },
    {
      field: "postedDate",
      headerName: "Posted Date",
      type: "date",
      width: 120,
      valueGetter: (params) => new Date(params.row.postedDate),
    },
    {
      field: "active",
      headerName: "Active",
      description: "This column has boolean values and is not sortable.",
      sortable: false,
      width: 90,
      renderCell: (params) => (
        <Switch
          checked={params.value}
          onChange={() => lunchPublishModal(params.row)}
          inputProps={{ "aria-label": "controlled" }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      headerClassName: "rounded-tr col-span-6",
      className: "rounded-tr col-span-6",
      sortable: false,
      width: 100,
      renderCell: (params) => (
        <div className="flex justify-evenly space-x-2">
          <button
            onClick={() => lunchDeletionModal([params.row.id])}
            className="bg-red-500 hover:bg-red-700 shadow-sm shadow-blue-500 text-white font-bold py-2 px-4 h-9 rounded"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  /**
   * Delete all selected events
   * @param {Array} ids Array of ids.
   * @param {Array} setSelected An array of selected rows.
   */
  const handleDeletion = async () => {
    setIsLoading(true);
    if (ids.length > 1) {
      deleteEvents(ids, setState, setApiError, setIsLoading);
    } else {
      deleteEvent(ids[0], setState, setApiError, setIsLoading);
    }
    setIds([]);
  };

  useEffect(() => {
    setIsLoading(true);
    getAllEvents(params, setApiError, setEventsData, setIsLoading);
  }, [state, setIsLoading, params]);

  return (
    <Container maxWidth="xl">
      <div className="mt-16 mx-6">
        <CustomDataTable
          addRecordButtonTitle={"Add Event"}
          headerColumn={headerColumnsArray}
          lunchCreateModal={() => setShowCreationModal(true)}
          lunchDeletionModal={lunchDeletionModal}
          paginationModel={params}
          rows={eventsData}
          setPaginationModel={setParams}
          tableTitle={"Events"}
        />
        <Modal isOpen={showCreationModal} onClose={setShowCreationModal}>
          <EventForm setState={setState} toggleModal={setShowCreationModal} />
        </Modal>
        <Modal isOpen={showEditionModal} onClose={setShowEditionModal}>
          <EventForm
            event={event}
            mediaFiles={eventMedia}
            updateEvent={updateEvent}
            toggleModal={setShowEditionModal}
            setState={setState}
            isUpdating={true}
          />
        </Modal>
        <Modal isOpen={showDeletionModal} onClose={setShowDeletionModal}>
          <Cancellation
            actionHandler={handleDeletion}
            actionText={"Delete"}
            cancelText={"Go Back"}
            setOpen={setShowDeletionModal}
            title={`Delete Event${!!ids && ids.length >= 2 ? "s" : ""}`}
            warningMessage={`Are you sure you want to delete ${
              !!ids && (ids.length >= 2 ? "these events" : "this event")
            }?`}
          />
        </Modal>
        <Modal isOpen={showPublishModal} onClose={setShowPublishModal}>
          <Cancellation
            actionButtonColor={
              event.active
                ? "bg-blue-600 hover:bg-blue-500"
                : "bg-red-600 hover:bg-red-500"
            }
            actionHandler={handlePublish}
            actionText={!event.active ? "Unpublish" : "Publish"}
            cancelText={"Go Back"}
            setOpen={setShowPublishModal}
            title={!event.active ? "Unpublish Event" : "Publish Event"}
            warningMessage={`Are you sure you want to ${
              !event.active ? "unpublish" : "publish"
            } this event?`}
          />
        </Modal>
      </div>
      <ToastContainer />
    </Container>
  );
};

export default Events;
