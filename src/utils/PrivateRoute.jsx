/** @format */

import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import toast from "react-hot-toast";

const PrivateRoute = () => {
  const { token, handleGetUser, user } = useAuth();

  useEffect(() => {
    if (!token) {
      toast.error(`You have to Log In First`, {
        id: "unique",
      });
    } else {
      handleGetUser();
    }
  }, []);

  return token ? <Outlet /> : <Navigate to="/signin" />;
};

export default PrivateRoute;
