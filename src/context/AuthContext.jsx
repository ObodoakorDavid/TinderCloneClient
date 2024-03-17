/** @format */

import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosConfig";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // keeps track of the state of authenticating
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  // gets token from localStorage if it exists
  const [token, setToken] = useState(
    () => JSON.parse(localStorage.getItem("token")) || null
  );

  const navigate = useNavigate();

  //SignUp User
  const handleSignUp = async (body) => {
    setIsAuthenticating(true);
    setTimeout(async () => {
      try {
        const { data } = await axiosInstance.post("/api/auth/register", body);
        console.log(data);
        setToken(data.token);
        localStorage.setItem("token", JSON.stringify(data.token));
        setUser({ id: data.id, image: data.image });
        toast.success("Registration Successful");
        navigate("/user");
      } catch (error) {
        console.log(error.response.data.message);
        toast.error(error.response.data.message);
      } finally {
        setIsAuthenticating(false);
      }
    }, 2000);
  };

  // SignIn User
  const handleSignIn = async (body) => {
    setIsAuthenticating(true);
    setTimeout(async () => {
      try {
        const { data } = await axiosInstance.post("/api/auth/login", body);
        setToken(data.token);
        localStorage.setItem("token", JSON.stringify(data.token));
        setUser({ id: data.id, image: data.image });
        toast.success("LogIn Successful");
        navigate("/user");
      } catch (error) {
        console.log(error.response?.data.message);
        toast.error(error.response?.data.message);
      } finally {
        setIsAuthenticating(false);
      }
    }, 2000);
  };

  // Logout User
  const handleLogOut = () => {
    localStorage.removeItem("token");
    toast.success("LogOut Successful");
    setToken(null);
    navigate("/");
  };

  // Get User
  const handleGetUser = async () => {
    try {
      const { data } = await axiosInstance.get("/api/auth/user", {
        headers: {
          Authorization: token ? `Bearer ${token}` : null,
        },
      });
      // console.log(data);
      setUser({ id: data.userProfile._id, image: data.userProfile.image });
      // navigate("/user");
    } catch (err) {
      console.log(err);
      localStorage.removeItem("token");
      setToken(null);
      navigate("/signin");
    }
  };

  // Update User Profile
  const handleUpdateUser = async (formData) => {
    setIsAuthenticating(true);
    try {
      const { data } = await axiosInstance.post("/api/auth/user", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(data);
      toast.success(data.message);
      navigate("/");
    } catch (error) {
      const {
        response: { data },
      } = error;
      console.log(data);
      toast.error(data.message);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const contextData = {
    user,
    token,
    isAuthenticating,
    handleSignIn,
    handleSignUp,
    handleGetUser,
    handleLogOut,
    handleUpdateUser,
  };
  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
