import React, { createContext, useContext, useState, useEffect } from "react";
import { getAllUsers } from "../users/UserService";
import { useLoadingSpinner } from "../../utils/components/LoadingSpinnerProvider";
import { EntitiesListResponseModel } from "../../utils/models/EntitiesListResponseModel";

export const UserContext = createContext();

/**
 * Provide all users globaly.
 * @param {JSX} param0 All JSX children element.
 * @returns The user provider component.
 */
export const UserProvider = ({ children }) => {
  const setIsLoading = useLoadingSpinner();
  const [updateUsersData, setUpdateUsersData] = useState(false);
  const [params, setParams] = useState({ pageSize: 5, page: 0 });
  const [usersData, setUsersData] = useState(EntitiesListResponseModel);

  useEffect(() => {
    setIsLoading(true);
    getAllUsers(setUsersData, setIsLoading, params);
  }, [updateUsersData, setIsLoading, params]);

  return (
    <UserContext.Provider
      value={{ usersData, params, setUpdateUsersData, setParams }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const { usersData, params, setUpdateUsersData, setParams } =
    useContext(UserContext);
  return { usersData, params, setUpdateUsersData, setParams };
};
