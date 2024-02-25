import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <Link to="/signin">SignIn</Link>
      <Link to="/signup">SignUp</Link>
      <Link to="/chat">ChatHome</Link>
    </div>
  );
};

export default Home;
