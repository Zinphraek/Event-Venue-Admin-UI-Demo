import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useUsers } from "../provider/UserProvider";
import { Button, Container } from "@mui/material";
import Switch from "@mui/material/Switch";
import { deleteUser, deleteUsers, updateUser } from "./UserService";
import { UserModel } from "../../utils/models/UserModel";
import { useLoadingSpinner } from "../../utils/components/LoadingSpinnerProvider";
import {
  convertKeysToUpperSnakeCase,
  formatDateInput2,
} from "../../utils/functions/Helpers";
import Modal from "../../utils/components/Modal";
import Tooltip from "@mui/material/Tooltip";
import UserForm from "./UserForm";
import Cancellation from "../../utils/components/Cancellation";
import CustomDataTable from "../../utils/components/CustomDataTable";
import { EntitiesListResponseModel } from "../../utils/models/EntitiesListResponseModel";

/**
 * @returns The User UI component.
 */
const Users = () => {
  const [ids, setIds] = useState(null);
  const setIsLoading = useLoadingSpinner();
  const [user, setUser] = useState(UserModel);
  const [apiError, setApiError] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEnableModalOpen, setIsEnableModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeletionModalOpen, setIsDeletionModalOpen] = useState(false);
  const { usersData, params, setUpdateUsersData, setParams } = useUsers();

  const mapIdsToUserIds = (ids = [], userModels) => {
    const idToUserId = userModels.content.reduce((acc, userModel) => {
      acc[userModel.id] = userModel.userId;
      return acc;
    }, {});

    return ids.map((id) => idToUserId[id] ?? null);
  };

  /**
   * Delete all users selected.
   * @param {Array} ids Array of ids
   * @param {Function} setSelected Manage the number of all selected users
   */
  const handleDeletion = async () => {
    const userIds = mapIdsToUserIds(ids, usersData);
    setIsLoading(true);
    if (ids.length > 1) {
      deleteUsers(userIds, setUpdateUsersData, setIsLoading, setApiError);
    } else {
      deleteUser(userIds[0], setUpdateUsersData, setIsLoading, setApiError);
    }
    setIds([]);
  };

  /**
   * Lunch the user edition modal
   * @param {object} userRow The user's row to edit
   */
  const lunchEditionModal = (userToEdit) => {
    setUser(userToEdit);
    setIsEditModalOpen(true);
  };

  const lunchDeletionModal = (selectedIds) => {
    setIds(selectedIds);
    setIsDeletionModalOpen(true);
  };

  const lunchCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const lunchEnableModal = (user) => {
    const updatedUser = {
      ...user,
      enabled: !user.enabled,
      dateOfBirth: formatDateInput2(user.dateOfBirth),
    };
    setUser(updatedUser);
    setIsEnableModalOpen(true);
  };

  const handleEnable = async () => {
    setIsLoading(true);
    await updateUser(user, setIsLoading, setUpdateUsersData, setApiError);
    !apiError && setIsEnableModalOpen(false);
  };

  const accessorsObject = convertKeysToUpperSnakeCase(UserModel);

  const userHeaderColumns = [
    {
      field: accessorsObject.ID,
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
    { field: accessorsObject.USER_ID, headerName: "User ID", width: 310 },
    { field: accessorsObject.FIRST_NAME, headerName: "First name", width: 130 },
    { field: accessorsObject.LAST_NAME, headerName: "Last name", width: 130 },
    {
      field: accessorsObject.EMAIL,
      headerName: "Email",
      width: 200,
      renderCell: (params) => (
        <a className="underline" href={`mailto:${params.value}`}>
          {params.value}
        </a>
      ),
    },
    {
      field: accessorsObject.PHONE,
      headerName: "Phone",
      width: 180,
      renderCell: (params) => (
        <Tooltip title={params.value} placement="top">
          <span className="truncate">
            <a className="underline" href={`mailto:${params.value}`}>
              {params.value}
            </a>
          </span>
        </Tooltip>
      ),
    },
    {
      field: accessorsObject.ENABLED,
      headerName: "Enabled",
      description: "This column has boolean values and is not sortable.",
      sortable: false,
      width: 90,
      renderCell: (params) => (
        <Switch
          checked={params.value}
          onChange={() => lunchEnableModal(params.row)}
          inputProps={{ "aria-label": "controlled" }}
        />
      ),
    },
  ];

  useEffect(() => {
    setParams({ pageSize: 5, page: 0 });
  }, [setParams]);

  return (
    <Container maxWidth="xl">
      <div className="mt-16 md:mx-6">
        <CustomDataTable
          addRecordButtonTitle={"Add User"}
          headerColumn={userHeaderColumns}
          lunchCreateModal={lunchCreateModal}
          lunchDeletionModal={lunchDeletionModal}
          paginationModel={params}
          rows={usersData ?? EntitiesListResponseModel}
          setPaginationModel={setParams}
          tableTitle={"USERS"}
        />
        <Modal
          isOpen={isEditModalOpen}
          onClose={setIsEditModalOpen}
          maxModalWidth="sm:max-w-4xl"
        >
          <UserForm
            userToEdit={user}
            updateUser={updateUser}
            setState={setUpdateUsersData}
            toggleModal={setIsEditModalOpen}
            isUpdating={true}
          />
        </Modal>
        <Modal
          isOpen={isCreateModalOpen}
          onClose={setIsCreateModalOpen}
          maxModalWidth="sm:max-w-4xl"
        >
          <UserForm
            setState={setUpdateUsersData}
            toggleModal={setIsCreateModalOpen}
          />
        </Modal>
        <Modal isOpen={isDeletionModalOpen} onClose={setIsDeletionModalOpen}>
          <Cancellation
            actionHandler={handleDeletion}
            actionText={"Delete"}
            cancelText={"Go Back"}
            setOpen={setIsDeletionModalOpen}
            title={`Delete User${!!ids && ids.length >= 2 ? "s" : ""}`}
            warningMessage={`Are you sure you want to delete ${
              !!ids && (ids.length >= 2 ? "these users" : "this user")
            }?`}
          />
        </Modal>
        <Modal isOpen={isEnableModalOpen} onClose={setIsEnableModalOpen}>
          <Cancellation
            actionButtonColor={
              user.enabled
                ? "bg-blue-600 hover:bg-blue-500"
                : "bg-red-600 hover:bg-red-500"
            }
            actionHandler={handleEnable}
            actionText={!user.enabled ? "Disable" : "Enable"}
            cancelText={"Go Back"}
            setOpen={setIsEnableModalOpen}
            title={!user.enabled ? "Disable User" : "Enable User"}
            warningMessage={`Are you sure you want to ${
              !user.enabled ? "disable" : "enable"
            } this user?`}
          />
        </Modal>

        <ToastContainer />
      </div>
    </Container>
  );
};

export default Users;
