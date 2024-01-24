import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useUsers } from "../provider/UserProvider";
import { capitalize, formatDate } from "../../utils/functions/Helpers";
import {
  ReservationModel,
  ReservKeysName,
} from "../../utils/models/ReservationModel";
import Constants from "../../utils/constants/Constants";
import { EntitiesListResponseModel } from "../../utils/models/EntitiesListResponseModel";
import {
  getAllReservations,
  cancelReservation,
  cancelReservations,
  updateReservation,
  updateReservationStatus,
} from "./ReservationsServices";
import { useLoadingSpinner } from "../../utils/components/LoadingSpinnerProvider";
import CustomDataTable from "../../utils/components/CustomDataTable";
import { Button, Container, Tooltip } from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import Modal from "../../utils/components/Modal";
import ReservationForm from "./ReservationForm";
import Cancellation from "../../utils/components/Cancellation";
import TakeActionForm from "./TakeActionForm";
import CustomToast from "../../utils/functions/CustomToast";

/**
 * The Reservation UI component.
 */
const Reservations = () => {
  const [reservationsData, setReservationsData] = useState(
    EntitiesListResponseModel
  );
  const [showCreationModal, setShowCreationModal] = useState(false);
  const [showDeletionModal, setShowDeletionModal] = useState(false);
  const [showTakeActionModal, setShowTakeActionModal] = useState(false);
  const [showEditionModal, setShowEditionModal] = useState(false);
  const [params, setParams] = useState({ pageSize: 5, page: 0 });
  const [apiError, setApiError] = useState(false);
  const setIsLoading = useLoadingSpinner();
  const { usersData, setParams: setUsersParams } = useUsers();
  const [ids, setIds] = useState([]);
  const [reservation, setReservation] = useState(ReservationModel);
  const [state, setState] = useState(false);

  const lunchTakeActionModal = (selectedReservation) => {
    setReservation(selectedReservation);
    setShowTakeActionModal(true);
  };

  const handleTakeAction = async (action) => {
    if (action !== "") {
      setIsLoading(true);
      await updateReservationStatus(
        reservation.id,
        reservation.userId,
        action,
        setState,
        setApiError,
        setIsLoading
      );
      !apiError && setShowTakeActionModal(false);
    } else {
      CustomToast("No action was taken", "info");
      setShowTakeActionModal(false);
    }
  };

  const lunchDeletionModal = (selectedIds) => {
    setIds(selectedIds);
    setShowDeletionModal(true);
  };

  /**
   * Delete all selected reservations.
   */
  const handleDeletion = async () => {
    setIsLoading(true);
    if (ids.length > 1) {
      cancelReservations(ids, setState, setApiError, setIsLoading);
    } else {
      cancelReservation(ids[0], setState, setApiError, setIsLoading);
    }
    setIds([]);
  };

  /**
   * Lunch the reservation edition modal
   * @param {object} reservationRow The reservation's row to edit
   */
  const lunchEditionModal = (reservationRow) => {
    setReservation(reservationRow);
    setShowEditionModal(true);
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
      style: "text-white bg-blue-500 shadow-sm shadow-yellow-500",
      icon: <AutorenewRoundedIcon fontSize="small" />,
    },
    [Constants.STATUS.Requested]: {
      style: "text-white bg-yellow-500 shadow-sm shadow-blue-500",
      icon: <CheckRoundedIcon fontSize="small" />,
    },
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
      field: "userId",
      headerName: ReservKeysName.userId,
      width: 150,
      renderCell: (params) => {
        const user =
          usersData.content.find((user) => (user.userId = params.row.userId)) ??
          null;
        return <span>{`${user?.firstName} ${user?.lastName}`}</span>;
      },
    },
    {
      field: "startingDateTime",
      headerName: ReservKeysName.startingDateTime,
      width: 170,
      renderCell: (params) =>
        params?.value ? formatDate(params.value) : "N/A",
    },
    {
      field: "endingDateTime",
      headerName: ReservKeysName.endingDateTime,
      width: 170,
      renderCell: (params) =>
        params?.value ? formatDate(params.value) : "N/A",
    },
    {
      field: "effectiveEndingDateTime",
      headerName: ReservKeysName.effectiveEndingDateTime,
      width: 170,
      renderCell: (params) =>
        params?.value ? formatDate(params.value) : "N/A",
    },
    {
      field: "eventType",
      headerName: ReservKeysName.eventType,
      width: 150,
      renderCell: (params) => capitalize(params?.value),
    },
    {
      field: "numberOfSeats",
      headerName: ReservKeysName.numberOfSeats,
      type: "number",
      width: 100,
    },
    {
      field: "addOnsTotalCost",
      headerName: ReservKeysName.addOnsTotalCost,
      type: "number",
      width: 120,
    },
    {
      field: "status",
      headerName: ReservKeysName.status,
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
      field: "fullPackage",
      headerName: ReservKeysName.fullPackage,
      width: 110,
      renderCell: (params) => (params?.value ? "Yes" : "No"),
    },
    {
      field: "securityDepositRefunded",
      headerName: ReservKeysName.securityDepositRefunded,
      width: 115,
      renderCell: (params) => (params?.value ? "Yes" : "No"),
    },
    {
      field: "taxRate",
      headerName: ReservKeysName.taxRate,
      type: "number",
      width: 100,
    },
    {
      field: "totalPrice",
      headerName: ReservKeysName.totalPrice,
      type: "number",
      width: 115,
    },
    {
      field: "discount",
      headerName: ReservKeysName.discount,
      width: 120,
      renderCell: (params) =>
        params?.value
          ? params?.value.type === "Percentage"
            ? `${params?.value.percentage}%`
            : `$${params?.value.amount}`
          : "No discount",
    },
    {
      field: "action",
      headerName: "Action",
      description: "Approve, reject or marke this reservation as done.",
      sortable: false,
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          disabled={!!(params.row.status === Constants.STATUS.Done)}
          onClick={() => lunchTakeActionModal(params.row)}
        >
          Take Action
        </Button>
      ),
    },
  ];

  useEffect(() => {
    setIsLoading(true);
    setUsersParams({ pageSize: "All", page: 0 });
    getAllReservations(params, setReservationsData, setApiError, setIsLoading);
  }, [state, setIsLoading, setUsersParams, params]);

  return (
    <Container maxWidth="xl">
      <div className="mt-16 mx-6">
        <CustomDataTable
          addRecordButtonTitle={"Add Reservation"}
          canBeDeleted={false}
          headerColumn={headerColumnsArray}
          lunchCreateModal={() => setShowCreationModal(true)}
          lunchDeletionModal={lunchDeletionModal}
          paginationModel={params}
          rows={reservationsData}
          setPaginationModel={setParams}
          tableTitle={"RESERVAIONS"}
        />
        <Modal isOpen={showCreationModal} onClose={setShowCreationModal}>
          <ReservationForm
            setState={setState}
            toggleModal={setShowCreationModal}
            usersData={usersData.content}
          />
        </Modal>
        <Modal isOpen={showEditionModal} onClose={setShowEditionModal}>
          <ReservationForm
            isEditing={true}
            reservation={reservation}
            setState={setState}
            toggleModal={setShowEditionModal}
            updateReservation={updateReservation}
            usersData={usersData.content}
          />
        </Modal>
        <Modal isOpen={showDeletionModal} onClose={setShowDeletionModal}>
          <Cancellation
            actionHandler={handleDeletion}
            actionText={"Delete"}
            cancelText={"Go Back"}
            setOpen={setShowDeletionModal}
            title={`Delete Reservation${!!ids && ids.length >= 2 ? "s" : ""}`}
            warningMessage={`Are you sure you want to delete ${
              !!ids &&
              (ids.length >= 2 ? "these reservations" : "this reservation")
            }?`}
          />
        </Modal>
        <Modal isOpen={showTakeActionModal} onClose={setShowTakeActionModal}>
          <TakeActionForm
            handleAction={handleTakeAction}
            reservation={reservation}
            toggleModal={setShowTakeActionModal}
          />
        </Modal>
        <ToastContainer />
      </div>
    </Container>
  );
};

export default Reservations;
