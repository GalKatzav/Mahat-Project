// src/services/protectedRoute/ProtectedUserRoute.js

import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext"; // Update the import path as needed

const ProtectedUserRoute = ({ children }) => {
  const { user } = useUser();

  if (!user) {
    // User is not logged in, redirect to the login page
    return <Navigate to="/Log_In" />;
  }

  // User is logged in, render the children components
  return children;
};

export default ProtectedUserRoute;
