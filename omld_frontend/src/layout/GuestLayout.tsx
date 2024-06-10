import {Navigate, Outlet} from "react-router-dom";
import React, { useState, ReactNode } from 'react';

import { useStateContext } from "../context/ContextProvider";


const GuestLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {  token, setUser, setToken, notification } = useStateContext();

  if(token) {
    return (
      <Navigate to="/" />
     );
  }

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      {children}
    </div>
  );
};

export default GuestLayout;
