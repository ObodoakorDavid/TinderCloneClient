/** @format */

import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import toast from "react-hot-toast";

const PrivateRoute = () => {
  const { token, handleGetUser, user } = useAuth();
  const [isLoding, setIsLoding] = useState(true);

  useEffect(() => {
    if (!token) {
      toast.error(`You have to Log In First`, {
        id: "unique",
      });
      setIsLoding(false);
      return;
    }

    const fetchData = async () => {
      try {
        await handleGetUser();
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoding(false);
      }
    };

    fetchData();
  }, []);

  if (isLoding) {
    // You can customize the loading indicator (e.g., display a spinner)
    return <p>Loading...</p>;
  }

  console.log(user);

  return token ? <Outlet /> : <Navigate to="/signin" />;
};

export default PrivateRoute;
