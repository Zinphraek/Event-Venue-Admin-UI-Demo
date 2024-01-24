import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { AppointmentModel } from "../../utils/models/AppointmentModel";
import { EntitiesListResponseModel } from "../../utils/models/EntitiesListResponseModel";
import {
  getAllAppointments,
  deleteAppointment,
  deleteAppointments,
  cancelAppointment,
  restoreAppointment,
  updateAppointment,
} from "./AppointmentServices";
import { useLoadingSpinner } from "../../utils/components/LoadingSpinnerProvider";
import { Button, Container, Tooltip } from "@mui/material";
import { formatDate } from "../../utils/functions/Helpers";
import Constants from "../../utils/constants/Constants";
import CustomDataTable from "../../utils/components/CustomDataTable";
import Modal from "../../utils/components/Modal";
import AppointmentForm from "./AppointmentForm";
import Cancellation from "../../utils/components/Cancellation";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";

/**
 * The appointment UI component.
 * @returns A table of Appointments with functionalities.
 */
const Appointments = () => {
  const [ids, setIds] = useState(null);
  const [appointmentsData, setAppointmentsData] = useState(
    EntitiesListResponseModel
  );
  const [params, setParams] = useState({ pageSize: 5, page: 0 });
  const [apiError, setApiError] = useState(false);
  const [action, setAction] = useState("");
  const [state, setState] = useState(false);
  const setIsLoading = useLoadingSpinner();
  const [showEditionModal, setShowEditionModal] = useState(false);
  const [appointment, setAppointment] = useState(AppointmentModel);
  const [showCreationModal, setShowCreationModal] = useState(false);
  const [showDeletionModal, setShowDeletionModal] = useState(false);
  const [showAtionModal, setShowAtionModal] = useState(false);

  const lunchDeletionModal = (selectedIds) => {
    setIds(selectedIds);
    setShowDeletionModal(true);
  };

  const handleDeletion = async () => {
    setIsLoading(true);
    if (ids.length > 1) {
      deleteAppointments(ids, setState, setApiError, setIsLoading);
    } else {
      deleteAppointment(ids[0], setState, setApiError, setIsLoading);
    }
    !apiError && setShowDeletionModal(false);
  };

  /**
   * Lunch the appointment edition modal
   * @param {object} appointmentRow The appointment's row to edit
   */
  const lunchEditionModal = (appointmentRow) => {
    setAppointment(appointmentRow);
    setShowEditionModal(true);
  };

  const lunchActionModal = (appointmentRow, action) => {
    setAppointment(appointmentRow);
    setAction(action);
    setShowAtionModal(true);
  };

  const statusIcon = {
    [Constants.STATUS.Booked]: {
      style: "text-white bg-blue-500 shadow-sm shadow-yellow-500",
      icon: <CheckRoundedIcon fontSize="small" />,
    },
    [Constants.STATUS.Done]: {
      style: "text-white bg-green-500 shadow-sm shadow-blue-500",
      icon: <DoneAllRoundedIcon fontSize="small" />,
    },
    [Constants.STATUS.Cancelled]: {
      style: "text-white bg-red-500 shadow-sm shadow-yellow-500",
      icon: <ErrorOutlineRoundedIcon fontSize="small" />,
    },
    [Constants.STATUS.Pending]: {
      style: "text-white bg-yellow-500 shadow-sm shadow-blue-500",
      icon: <AutorenewRoundedIcon fontSize="small" />,
    },
    [Constants.STATUS.Requested]: {
      style: "text-white bg-yellow-500 shadow-sm shadow-blue-500",
      icon: <CheckRoundedIcon fontSize="small" />,
    },
  };

  const handleAction = async () => {
    setIsLoading(true);
    if (action === "Cancel") {
      await cancelAppointment(
        appointment.id,
        setState,
        setApiError,
        setIsLoading
      );
    } else {
      await restoreAppointment(
        appointment.id,
        setState,
        setApiError,
        setIsLoading
      );
    }
    !apiError && setShowAtionModal(false);
  };

  const headerColumnsArray = [
    {
      field: "id",
      headerName: "ID",
      width: 90,
      renderCell: (params) => {
        const value = params?.value;
        const isInThePast = new Date(params?.row?.dateTime) < new Date();
        const isInThePastOrDone =
          isInThePast || value === Constants.STATUS.Done;
        const description = isInThePastOrDone
          ? "This appointment can only be deleted"
          : "Edit this appointment";

        return (
          <Tooltip title={description}>
            <span>
              <Button
                variant="contained"
                color="primary"
                size="small"
                disabled={isInThePastOrDone}
                onClick={() => lunchEditionModal(params.row)}
              >
                {params.value}
              </Button>
            </span>
          </Tooltip>
        );
      },
    },
    {
      field: "firstName",
      headerName: "First Name",
      width: 150,
    },
    {
      field: "lastName",
      headerName: "Last Name",
      width: 150,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      renderCell: (params) => (
        <a className="underline" href={`mailto:${params.value}`}>
          {params.value}
        </a>
      ),
    },
    {
      field: "dateTime",
      headerName: "Date and Time",
      width: 170,
      valueFormatter: (params) => formatDate(params?.value),
    },
    {
      field: "raison",
      headerName: "Reason",
      width: 300,
    },
    {
      field: "additionalInfo",
      headerName: "Additional Info",
      width: 350,
    },
    {
      field: "status",
      headerName: "Status",
      width: 175,
      renderCell: (params) => (
        <div
          className={`flex flex-row rounded items-center px-2 h-[34px] ${
            statusIcon[params.row.status].style
          }`}
        >
          <span className="m-2">{statusIcon[params.row.status].icon}</span>
          <span className="my-2 mr-2">{params.row.status}</span>
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params) => {
        const value = params?.row?.status;
        const isInThePast = new Date(params?.row?.dateTime) < new Date();
        const isInThePastOrDone =
          isInThePast || value === Constants.STATUS.Done;
        const isCancelable =
          !isInThePastOrDone && value !== Constants.STATUS.Cancelled;
        const description = isInThePastOrDone
          ? "This appointment can only be deleted"
          : isCancelable
          ? "Cancel this appointment"
          : "Restore this appointment";
        const action = isInThePastOrDone || isCancelable ? "Cancel" : "Restore";

        return (
          <Tooltip title={description}>
            <span>
              <button
                type="button"
                className={`font-bold py-2 px-4 rounded h-9 w-[80px] shadow-sm shadow-yellow-500 ${
                  isInThePastOrDone
                    ? "bg-gray-300 shadow-yellow-50 text-gray-400 hover:bg-gray-300"
                    : " text-white"
                } ${
                  isCancelable
                    ? "bg-red-500 hover:bg-red-700"
                    : "bg-blue-500 hover:bg-blue-700"
                } mx-2`}
                onClick={() => lunchActionModal(params.row, action)}
                disabled={isInThePastOrDone}
              >
                {action}
              </button>
            </span>
          </Tooltip>
        );
      },
    },
  ];

  useEffect(() => {
    setIsLoading(true);
    getAllAppointments(setAppointmentsData, params, setApiError, setIsLoading);
  }, [state, setIsLoading, params]);

  return (
    <Container maxWidth="xl">
      <div className="mt-16 mx-6">
        <CustomDataTable
          addRecordButtonTitle={"Add Appointment"}
          headerColumn={headerColumnsArray}
          lunchCreateModal={() => setShowCreationModal(true)}
          lunchDeletionModal={lunchDeletionModal}
          paginationModel={params}
          rows={appointmentsData}
          setPaginationModel={setParams}
          tableTitle={"Appointments"}
        />
        <Modal isOpen={showEditionModal} onClose={setShowEditionModal}>
          <AppointmentForm
            appointment={appointment}
            updateAppointment={updateAppointment}
            toggleModal={setShowEditionModal}
            setState={setState}
            isUpdating={true}
          />
        </Modal>
        <Modal isOpen={showCreationModal} onClose={setShowCreationModal}>
          <AppointmentForm
            toggleModal={setShowCreationModal}
            setState={setState}
          />
        </Modal>
        <Modal isOpen={showDeletionModal} onClose={setShowDeletionModal}>
          <Cancellation
            actionHandler={handleDeletion}
            actionText={"Delete"}
            cancelText={"Go Back"}
            setOpen={setShowDeletionModal}
            title={`Delete Appointment${!!ids && ids.length >= 2 ? "s" : ""}`}
            warningMessage={`Are you sure you want to delete ${
              !!ids &&
              (ids.length >= 2 ? "these appointments" : "this appointment")
            }?`}
          />
        </Modal>
        <Modal isOpen={showAtionModal} onClose={setShowAtionModal}>
          <Cancellation
            actionHandler={handleAction}
            actionText={action}
            cancelText={"Go Back"}
            setOpen={setShowAtionModal}
            title={`${action} Appointment`}
            warningMessage={`Are you sure you want to ${action.toLowerCase()} this appointment?`}
          />
        </Modal>
        <ToastContainer />
      </div>
    </Container>
  );
};

export default Appointments;
