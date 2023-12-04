import React, { createContext, useMemo, useState, Dispatch, SetStateAction } from "react";

type camPreviewContextData = {
  camState: boolean,
  setCamState: Dispatch<React.SetStateAction<boolean>>;
}

export const CamPreviewContext = createContext<camPreviewContextData>({camState: false, setCamState: (newValue: SetStateAction<boolean>) => {}});

export const CamPreviewContextProvider:React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [camState, setCamState] = useState(false);

  const contextValue = useMemo(() => {
    return {
        camState,
        setCamState
    };
  }, [camState]);

  
  return (
    <CamPreviewContext.Provider value={contextValue}>
      {children}
    </CamPreviewContext.Provider>
  )
}