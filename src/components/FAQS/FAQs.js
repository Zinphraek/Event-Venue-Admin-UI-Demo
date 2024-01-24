import React, { useEffect, useState } from "react";
import { FAQModel } from "../../utils/models/FAQModel";
import { EntitiesListResponseModel } from "../../utils/models/EntitiesListResponseModel";
import Modal from "../../utils/components/Modal";
import Cancellation from "../../utils/components/Cancellation";
import FAQForm from "./FAQForm";
import { Button } from "@mui/material";
import { ToastContainer } from "react-toastify";
import { getAllFAQs, deleteFAQ, deleteFAQs, updateFAQ } from "./FAQService";
import { useLoadingSpinner } from "../../utils/components/LoadingSpinnerProvider";
import { Container } from "@mui/material";
import CustomDataTable from "../../utils/components/CustomDataTable";

/**
 * FAQs component displays a list of frequently asked questions.
 * It allows users to edit, delete, and create new FAQs.
 */
const FAQs = () => {
  const [ids, setIds] = useState(null);
  const setIsLoading = useLoadingSpinner();
  const [FAQ, setFAQ] = useState(FAQModel);
  const [state, setState] = useState(false);
  const [params, setParams] = useState({ pageSize: 5, page: 0 });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [faqsData, setFAQsData] = useState(EntitiesListResponseModel);
  const [isDeletionModalOpen, setIsDeletionModalOpen] = useState(false);

  const lunchEditionModal = (faq) => {
    setFAQ(faq);
    setIsEditModalOpen(true);
  };

  const lunchDeletionModal = (selectedIds) => {
    setIds(selectedIds);
    setIsDeletionModalOpen(true);
  };

  const deleteFAQHandler = async () => {
    if (!!ids && ids.length > 0) {
      setIsLoading(true);
      if (ids.length === 1) {
        await deleteFAQ(ids[0], setState, setIsLoading);
      } else {
        await deleteFAQs(ids, setState, setIsLoading);
      }
      setState((prev) => !prev);
    }
    setIsDeletionModalOpen(false);
    setState((prev) => !prev);
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
      field: "question",
      headerName: "Question",
      width: 350,
      renderCell: (params) => (
        <div className="flex">
          <span>{params.value}</span>
        </div>
      ),
    },
    {
      field: "answer",
      headerName: "Answer",
      width: 350,
    },
    {
      field: "moreDetail",
      headerName: "More Details",
      width: 400,
    },
    {
      field: "actions",
      headerName: "Actions",
      headerClassName: "rounded-tr col-span-6",
      className: "rounded-tr col-span-6",
      sortable: false,
      width: 200,
      renderCell: (params) => (
        <div className="flex justify-evenly space-x-2">
          <button
            onClick={() => lunchEditionModal(params.row)}
            className="bg-blue-500 hover:bg-blue-700 shadow-sm shadow-yellow-500 text-white font-bold py-2 px-4 rounded h-9 w-[70px]"
          >
            Edit
          </button>
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
    setIsLoading(true);
    getAllFAQs(setFAQsData, setIsLoading, params);
  }, [state, setIsLoading, params]);

  return (
    <Container maxWidth="xl">
      <div className="mt-16 mx-6">
        <CustomDataTable
          addRecordButtonTitle={"Add FAQ"}
          headerColumn={headerColumnsArray}
          lunchCreateModal={() => setIsCreateModalOpen(true)}
          lunchDeletionModal={lunchDeletionModal}
          paginationModel={params}
          rows={faqsData}
          setPaginationModel={setParams}
          tableTitle={"FAQs"}
        />
        <Modal isOpen={isEditModalOpen} onClose={setIsEditModalOpen}>
          <FAQForm
            faqToEdit={FAQ}
            isUpdating={true}
            setState={setState}
            toggleModal={setIsEditModalOpen}
            updateFAQ={updateFAQ}
          />
        </Modal>
        <Modal isOpen={isCreateModalOpen} onClose={setIsCreateModalOpen}>
          <FAQForm
            isUpdating={false}
            setState={setState}
            toggleModal={setIsCreateModalOpen}
          />
        </Modal>
        <Modal isOpen={isDeletionModalOpen} onClose={setIsDeletionModalOpen}>
          <Cancellation
            actionHandler={deleteFAQHandler}
            actionText={"Delete"}
            cancelText={"Go Back"}
            setOpen={setIsDeletionModalOpen}
            title={`Delete FAQ${!!ids && ids.length >= 2 ? "s" : ""}`}
            warningMessage={`Are you sure you want to delete ${
              !!ids && (ids.length >= 2 ? "these FAQs" : "this FAQ")
            }?`}
          />
        </Modal>
        <ToastContainer />
      </div>
    </Container>
  );
};

export default FAQs;
