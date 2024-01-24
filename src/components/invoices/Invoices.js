import React, { useEffect, useState } from "react";
import { InvoiceModel } from "../../utils/models/InvoiceModel";
import { EntitiesListResponseModel } from "../../utils/models/EntitiesListResponseModel";
import Modal from "../../utils/components/Modal";
import ReceiptForm from "../receipts/ReceiptForm";
import InvoiceForm from "./InvoiceForm";
import Cancellation from "../../utils/components/Cancellation";
import {
  getAllInvoices,
  deleteInvoice,
  deleteInvoices,
  updateInvoice,
} from "./InvoiceService";
import { ToastContainer } from "react-toastify";
import MultiStepsInvoiceForm from "./MultiStepsInvoiceForm";
import { getAllUsers } from "../users/UserService";
import { useLoadingSpinner } from "../../utils/components/LoadingSpinnerProvider";
import { Button } from "@mui/material";
import { Container } from "@mui/material";
import Constants from "../../utils/constants/Constants";
import CustomDataTable from "../../utils/components/CustomDataTable";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";

const Invoices = () => {
  const [ids, setIds] = useState(null);
  const setIsLoading = useLoadingSpinner();
  const [state, setState] = useState(false);
  const [params, setParams] = useState({ pageSize: 5, page: 0 });
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [invoice, setInvoice] = useState(InvoiceModel);
  const [isDeletionModalOpen, setIsDeletionModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [invoices, setInvoices] = useState(EntitiesListResponseModel);
  const [usersData, setUsersData] = useState(EntitiesListResponseModel);

  const lunchEditionModal = (invoice) => {
    setInvoice(invoice);
    setIsEditModalOpen(true);
  };

  const lunchDeletionModal = (selectedIds) => {
    setIds(selectedIds);
    setIsDeletionModalOpen(true);
  };

  const lunchCreateModal = async () => {
    setIsLoading(true);
    await getAllUsers(setUsersData, setIsLoading, { pageSize: "All", page: 0 });
    setIsCreateModalOpen(true);
  };

  const deleteInvoiceHandler = async () => {
    if (!!ids && ids.length > 0) {
      setIsLoading(true);
      if (ids.length === 1) {
        await deleteInvoice(ids[0], setState, setIsLoading);
      } else {
        await deleteInvoices(ids, setState, setIsLoading);
      }
      setState((prev) => !prev);
    }
    setIsDeletionModalOpen(false);
    setState((prev) => !prev);
  };

  const lunchReceiptModal = (invoiceId) => {
    const invoice = invoices.content.find((i) => i.id === invoiceId);
    setInvoice(invoice);
    setIsReceiptModalOpen(true);
  };

  const statusIcon = {
    [Constants.INVOICE_STATUS.PAID]: {
      style: "text-white bg-green-500 shadow-sm shadow-blue-500",
      icon: <DoneAllRoundedIcon fontSize="small" />,
    },
    [Constants.INVOICE_STATUS.DUE]: {
      style: "text-white bg-yellow-500 shadow-sm shadow-blue-500",
      icon: <WarningAmberRoundedIcon fontSize="small" />,
    },
    [Constants.INVOICE_STATUS.PARTIALLY_PAID]: {
      style: "text-white bg-yellow-500 shadow-sm shadow-blue-500",
      icon: <CheckRoundedIcon fontSize="small" />,
    },
    [Constants.INVOICE_STATUS.OVERDUE]: {
      style: "text-white bg-red-500 shadow-sm shadow-blue-500",
      icon: <WarningAmberRoundedIcon fontSize="small" />,
    },
    [Constants.INVOICE_STATUS.WITHDWAWN]: {
      style: "text-white bg-gray-500 shadow-sm shadow-gray-900",
      icon: <ErrorOutlineRoundedIcon fontSize="small" />,
    },
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
      field: "invoiceNumber",
      headerName: "Invoice Number",
      width: 150,
    },
    {
      field: "fullName",
      headerName: "Customer name",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 210,
      valueGetter: (params) =>
        `${params.row.user.firstName || ""} ${params.row.user.lastName || ""}`,
    },
    {
      field: "issuedDate",
      headerName: "Issued Date",
      type: "date",
      width: 120,
      valueGetter: (params) => new Date(params.row.issuedDate),
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      type: "date",
      width: 120,
      valueGetter: (params) => new Date(params.row.dueDate),
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
      field: "amountDue",
      headerName: "Amount Due($)",
      type: "number",
      width: 120,
    },
    {
      field: "totalAmountPaid",
      headerName: "Total Paid($)",
      type: "number",
      width: 120,
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 150,
      renderCell: (params) => (
        <div className="flex">
          <button
            onClick={() => lunchReceiptModal(params.row.id)}
            disabled={params.row.status === Constants.INVOICE_STATUS.PAID}
            className={`bg-blue-500 hover:bg-blue-700 shadow-sm shadow-yellow-500 text-white font-bold py-2 px-4 rounded ${
              params.row.status === Constants.INVOICE_STATUS.PAID
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            Create receipt
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    setIsLoading(true);
    getAllInvoices(setInvoices, setIsLoading, params);
  }, [state, setIsLoading, params]);

  return (
    <Container maxWidth="xl">
      <div className="my-16 mx-6">
        <CustomDataTable
          addRecordButtonTitle={"Add Invoice"}
          headerColumn={headerColumnsArray}
          lunchCreateModal={lunchCreateModal}
          lunchDeletionModal={lunchDeletionModal}
          paginationModel={params}
          rows={invoices}
          setPaginationModel={setParams}
          tableTitle={"INVOICES"}
        />
        <Modal
          isOpen={isEditModalOpen}
          onClose={setIsEditModalOpen}
          maxModalWidth="sm:max-w-3xl"
        >
          <InvoiceForm
            invoiceToEdit={invoice}
            isUpdating={true}
            toggleModal={setIsEditModalOpen}
            updateInvoice={updateInvoice}
          />
        </Modal>
        <Modal isOpen={isDeletionModalOpen} onClose={setIsDeletionModalOpen}>
          <Cancellation
            actionHandler={deleteInvoiceHandler}
            actionText={"Delete"}
            cancelText={"Go Back"}
            setOpen={setIsDeletionModalOpen}
            title={`Delete Invoice${!!ids && ids.length >= 2 ? "s" : ""}`}
            warningMessage={`Are you sure you want to delete ${
              !!ids && (ids.length >= 2 ? "these invoices" : "this invoice")
            }?`}
          />
        </Modal>
        <Modal
          isOpen={isCreateModalOpen}
          onClose={setIsCreateModalOpen}
          maxModalWidth="sm:max-w-3xl"
        >
          <MultiStepsInvoiceForm
            setState={setState}
            toggleModal={setIsCreateModalOpen}
            usersData={usersData}
          />
        </Modal>
        <Modal
          isOpen={isReceiptModalOpen}
          onClose={setIsReceiptModalOpen}
          maxModalWidth="sm:max-w-3xl"
        >
          <ReceiptForm
            invoice={invoice}
            setState={setState}
            toggleModal={setIsReceiptModalOpen}
          />
        </Modal>
        <ToastContainer />
      </div>
    </Container>
  );
};

export default Invoices;
