import React, { Dispatch, SetStateAction, createContext, useMemo, useState } from "react";

type UserContextType = {
  userName: string,
  setUserName: Dispatch<React.SetStateAction<string>>;
  otherUserName: string,
  setOtherUserName: Dispatch<React.SetStateAction<string>>;
}

export const UserContext = createContext<UserContextType>({
  userName: "", 
  setUserName: (newValue: SetStateAction<string>) => {},
  otherUserName: "",
  setOtherUserName: (newValue: SetStateAction<string>) => {},
});

export const UserContextProdiver:React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userName, setUserName] = useState("");
  const [otherUserName, setOtherUserName] = useState("");

  const contextValue = useMemo(() => {
    return {
      userName,
      setUserName,
      otherUserName,
      setOtherUserName
    };
  }, [userName, otherUserName]);

  
  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  )
}