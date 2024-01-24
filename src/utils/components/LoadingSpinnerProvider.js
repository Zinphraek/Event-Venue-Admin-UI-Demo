import React, { createContext, useContext, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

const LoadingSpinnerContext = createContext();

const LoadingSpinnerProvider = ({children}) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingSpinnerContext.Provider value={setIsLoading}>
      {isLoading && <LoadingSpinner />}
      {children}
    </LoadingSpinnerContext.Provider>
  );
}

export const useLoadingSpinner = () => {
  const setIsLoading = useContext(LoadingSpinnerContext);
  return setIsLoading ;
}

export default LoadingSpinnerProvider;
