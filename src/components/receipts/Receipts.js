import React, { useEffect, useState } from "react";
import { useLoadingSpinner } from "../../utils/components/LoadingSpinnerProvider";
import { ReceiptModel } from "../../utils/models/ReceiptModel";
import { Button, Container, Tooltip } from "@mui/material";
import { EntitiesListResponseModel } from "../../utils/models/EntitiesListResponseModel";
import { getAllReceipts } from "./ReceiptService";
import CustomDataTable from "../../utils/components/CustomDataTable";
import { useUsers } from "../provider/UserProvider";
import Modal from "../../utils/components/Modal";
import MultiStepsReceiptForm from "./MultiStepsReceiptForm";
import ReceiptDetailsView from "./ReceiptDetailsView";
import ReceiptEmailingForm from "./ReceiptEmailingForm";
import { ToastContainer } from "react-toastify";

const Receipts = () => {
  const setIsLoading = useLoadingSpinner();
  const [state, setState] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [receipt, setReceipt] = useState(ReceiptModel);
  const [params, setParams] = useState({ pageSize: 5, page: 0 });
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { usersData, setParams: setUserParams } = useUsers();
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false);
  const [receiptsData, setReceiptsData] = useState(EntitiesListResponseModel);

  const lunchCreateModal = async () => {
    setUserParams({ pageSize: "All", page: 0 });
    setIsCreateModalOpen(true);
  };

  const getUserEmailAddress = (receipt) => {
    return usersData.content.find((u) => u.userId === receipt.userId).email;
  };

  const lunchEmailModal = (receipt) => {
    setReceipt(receipt);
    setEmailAddress(getUserEmailAddress(receipt));
    setIsEmailModalOpen(true);
  };

  const lunchViewDetailsModal = (receipt) => {
    setReceipt(receipt);
    setIsViewDetailsModalOpen(true);
  };

  const headerColumnsArray = [
    {
      field: "receiptNumber",
      headerName: "Receipt Number",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => lunchViewDetailsModal(params.row)}
        >
          {params.value}
        </Button>
      ),
    },
    {
      field: "receiptDate",
      headerName: "Receipt Date",
      type: "date",
      width: 120,
      valueGetter: (params) => new Date(params.row.receiptDate),
    },
    {
      field: "paymentDate",
      headerName: "Payment Date",
      type: "date",
      width: 120,
      valueGetter: (params) => new Date(params.row.paymentDate),
    },
    {
      field: "invoiceId",
      headerName: "Invoice #",
      width: 100,
      valueFormatter: (params) => `INV-000${params.value}`,
    },
    {
      field: "amountPaid",
      headerName: "Amount Paid($)",
      width: 130,
      type: "number",
    },
    {
      field: "balanceDue",
      headerName: "Remaining Bal($)",
      width: 140,
      type: "number",
    },
    {
      field: "paidBy",
      headerName: "Paid By",
      width: 150,
    },
    {
      field: "cashierName",
      headerName: "Cashier Name",
      width: 150,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 140,
      sortable: false,
      renderCell: (params) => {
        return (
          <div>
            <Tooltip title="Email receipt to customer" placement="top">
              <Button
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => lunchEmailModal(params.row)}
              >
                Email Receipt
              </Button>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    setIsLoading(true);
    getAllReceipts(setReceiptsData, setIsLoading, params);
  }, [setIsLoading, params, state]);

  return (
    <Container maxWidth="xl">
      <div className="mt-16 mx-6">
        <CustomDataTable
          addRecordButtonTitle={"Add Receipt"}
          canBeDeleted={false}
          headerColumn={headerColumnsArray}
          lunchCreateModal={lunchCreateModal}
          paginationModel={params}
          rows={receiptsData}
          setPaginationModel={setParams}
          tableTitle={"RECEIPTS"}
        />
        <Modal
          isOpen={isCreateModalOpen}
          onClose={setIsCreateModalOpen}
          maxModalWidth="sm:max-w-3xl"
        >
          <MultiStepsReceiptForm
            setState={setState}
            toggleModal={setIsCreateModalOpen}
            usersData={usersData}
          />
        </Modal>
        <Modal
          isOpen={isViewDetailsModalOpen}
          onClose={setIsViewDetailsModalOpen}
          maxModalWidth="sm:max-w-3xl"
        >
          <ReceiptDetailsView
            toggleModal={setIsViewDetailsModalOpen}
            receipt={receipt}
          />
        </Modal>
        <Modal isOpen={isEmailModalOpen} onClose={setIsEmailModalOpen}>
          <ReceiptEmailingForm
            toggleModal={setIsEmailModalOpen}
            receiptId={receipt.id}
            emailAddress={emailAddress}
          />
        </Modal>
        <ToastContainer />
      </div>
    </Container>
  );
};

export default Receipts;
