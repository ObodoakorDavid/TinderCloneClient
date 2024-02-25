import { useEffect, useState } from "react";
// import { socket } from "./utils/socket";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/Signup/SignUp";
import ChatHome from "./pages/ChatHome/ChatHome";
import Home from "./pages/Home/Home";
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";
import PrivateChat from "./pages/PrivateChat/PrivateChat";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <ChatProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route element={<PrivateRoute />}>
                <Route path="/chat" element={<ChatHome />} />
                <Route path="/chat/:recipientId" element={<PrivateChat />} />
              </Route>
            </Routes>
          </ChatProvider>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
