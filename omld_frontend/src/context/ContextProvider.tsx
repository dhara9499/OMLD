import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

interface StateContextType {
  user: any; // Define user property
  token: string | null;
  notification: string | null;
  setUser: Dispatch<SetStateAction<any>>;
  setToken: (token: string | null) => void;
  setNotification: (message: string | null) => void;
}

const initialState: StateContextType = {
  user: null, // Initialize user property
  token: null,
  notification: null,
  setUser: () => {},
  setToken: () => {},
  setNotification: () => {}
};

const StateContext = createContext<StateContextType>(initialState);

export const ContextProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [user, setUser] = useState<any>({});
  const [token, setTokenState] = useState<string | null>(
    localStorage.getItem("ACCESS_TOKEN")
  );
  const [notification, setNotificationState] = useState<string | null>("");

  const setToken = (token: string | null) => {
    setTokenState(token);
    if (token) {
      localStorage.setItem("ACCESS_TOKEN", token);
    } else {
      localStorage.removeItem("ACCESS_TOKEN");
    }
  };

  const setNotification = (message: string | null) => {
    setNotificationState(message);

    setTimeout(() => {
      setNotificationState(null);
    }, 5000);
  };

  return (
    <StateContext.Provider
      value={{
        user, // Use user state variable here
        setUser, // Set user state function
        token,
        setToken,
        notification,
        setNotification
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);