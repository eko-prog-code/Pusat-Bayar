import React, { createContext, useContext, useState } from 'react';

// Create Context
const LoadingContext = createContext();

// Custom hook to use the loading context
export const useLoading = () => useContext(LoadingContext);

// Provider component
export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};
