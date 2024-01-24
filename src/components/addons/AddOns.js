import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useAddOns } from "../provider/AddOnsProvider";
import { deleteAddOn, deleteAddOns, updateAddOn } from "./AddOnsService";
import { AddOnModel } from "../../utils/models/AddOnModel";
import { useLoadingSpinner } from "../../utils/components/LoadingSpinnerProvider";
import { Button, Container, Switch } from "@mui/material";
import CustomDataTable from "../../utils/components/CustomDataTable";
import Modal from "../../utils/components/Modal";
import AddOnForm from "./AddOnForm";
import Cancellation from "../../utils/components/Cancellation";

/**
 * @returns The addon component
 */
const AddOns = () => {
  const { addOnsData, params, setUpdateAddOnData, setParams } = useAddOns();
  const [showCreationModal, setShowCreationModal] = useState(false);
  const [showDeletionModal, setShowDeletionModal] = useState(false);
  const [isActiveModalOpen, setIsActiveModalOpen] = useState(false);
  const [showEditionModal, setShowEditionModal] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [addOn, setAddOn] = useState(AddOnModel);
  const setIsLoading = useLoadingSpinner();
  const [ids, setIds] = useState([]);

  /**
   * Delete all selected addOns
   * @param {Array} ids Array of ids.
   * @param {Array} setSelected An array of selected rows.
   */
  const handleDeletion = async () => {
    setIsLoading(true);
    if (ids.length > 1) {
      deleteAddOns(ids, setUpdateAddOnData, setIsLoading);
    } else {
      deleteAddOn(ids[0], setUpdateAddOnData, setIsLoading);
    }
    !apiError && setShowDeletionModal(false);
  };

  /**
   * Lunch the addOn edition modal
   * @param {object} rowAddOn The addOn's object to edit
   */
  const lunchEditionModal = (rowAddOn) => {
    setAddOn(rowAddOn);
    setShowEditionModal(true);
  };

  const lunchDeletionModal = (selectedIds) => {
    setIds(selectedIds);
    setShowDeletionModal(true);
  };

  const lunchActiveModal = (addOn) => {
    const updateAddOn = { ...addOn, active: !addOn.active };
    setAddOn(updateAddOn);
    setIsActiveModalOpen(true);
  };

  const handleActive = async () => {
    setIsLoading(true);
    await updateAddOn(
      addOn,
      null,
      setUpdateAddOnData,
      setApiError,
      setIsLoading
    );
    !apiError && setIsActiveModalOpen(false);
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
          {params.value}
        </Button>
      ),
    },
    {
      field: "name",
      headerName: "AddOn Name",
      width: 350,
    },
    {
      field: "category",
      headerName: "Category",
      width: 350,
    },
    {
      field: "price",
      headerName: "AddOn Price($)",
      type: "number",
      width: 130,
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
          onChange={() => lunchActiveModal(params.row)}
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

  useEffect(() => {
    setParams({ pageSize: 5, page: 0 });
  }, [setParams]);

  return (
    <Container maxWidth="xl">
      <div className="mt-16 mx-6">
        <CustomDataTable
          addRecordButtonTitle={"Add Add-On"}
          headerColumn={headerColumnsArray}
          lunchCreateModal={() => setShowCreationModal(true)}
          lunchDeletionModal={lunchDeletionModal}
          paginationModel={params}
          rows={addOnsData}
          setPaginationModel={setParams}
          tableTitle={"Add-Ons"}
        />
        <Modal isOpen={showCreationModal} onClose={setShowCreationModal}>
          <AddOnForm
            setState={setUpdateAddOnData}
            toggleModal={setShowCreationModal}
          />
        </Modal>
        <Modal isOpen={showEditionModal} onClose={setShowEditionModal}>
          <AddOnForm
            addOn={addOn}
            setState={setUpdateAddOnData}
            toggleModal={setShowEditionModal}
            updateAddOn={updateAddOn}
            isUpdating={true}
          />
        </Modal>
        <Modal isOpen={showDeletionModal} onClose={setShowDeletionModal}>
          <Cancellation
            actionHandler={handleDeletion}
            actionText={"Delete"}
            cancelText={"Go Back"}
            setOpen={setShowDeletionModal}
            title={`Delete Add-on${!!ids && ids.length >= 2 ? "s" : ""}`}
            warningMessage={`Are you sure you want to delete ${
              !!ids && (ids.length >= 2 ? "these add-ons" : "this add-on")
            }?`}
          />
        </Modal>
        <Modal isOpen={isActiveModalOpen} onClose={setIsActiveModalOpen}>
          <Cancellation
            actionButtonColor={
              addOn.active
                ? "bg-blue-600 hover:bg-blue-500"
                : "bg-red-600 hover:bg-red-500"
            }
            actionHandler={handleActive}
            actionText={!addOn.active ? "Deactivate" : "Activate"}
            cancelText={"Go Back"}
            setOpen={setIsActiveModalOpen}
            title={!addOn.active ? "Deactivate Add-on" : "Activate Add-on"}
            warningMessage={`Are you sure you want to ${
              !addOn.active ? "deactivate" : "activate"
            } this add-on?`}
          />
        </Modal>
      </div>
      <ToastContainer />
    </Container>
  );
};

export default AddOns;
