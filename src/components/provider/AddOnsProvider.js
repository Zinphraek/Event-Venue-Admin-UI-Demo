import React, { createContext, useContext, useState, useEffect } from "react";
import { getAllAddOns } from "../addons/AddOnsService";
import { EntitiesListResponseModel } from "../../utils/models/EntitiesListResponseModel";
import { useLoadingSpinner } from "../../utils/components/LoadingSpinnerProvider";

export const AddOnContext = createContext();

/**
 * Provide all addOns globaly.
 * @param {JSX} param0 All JSX children element.
 * @returns The addOn provider component.
 */
export const AddOnsProvider = ({ children }) => {
  const [addOnsData, setAddOnsData] = useState(EntitiesListResponseModel);
  const [params, setParams] = useState({ pageSize: 5, page: 0 });
  const [updateAddOnData, setUpdateAddOnData] = useState(false);
  const setIsLoading = useLoadingSpinner();

  useEffect(() => {
    setIsLoading(true);
    getAllAddOns(setAddOnsData, params, setIsLoading);
  }, [updateAddOnData, params, setIsLoading]);

  return (
    <AddOnContext.Provider
      value={{ addOnsData, params, setUpdateAddOnData, setParams }}
    >
      {children}
    </AddOnContext.Provider>
  );
};

export const useAddOns = () => {
  const { addOnsData, params, setUpdateAddOnData, setParams } =
    useContext(AddOnContext);
  return { addOnsData, params, setUpdateAddOnData, setParams };
};
