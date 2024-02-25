import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import Spinner from "../../utils/Spinner";
import { Link, useNavigate } from "react-router-dom";
// import "./SignIn.css";

const SignIn = () => {
  const { handleSignIn, isAuthenticating, token } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    handleSignIn(data);
  };

  const btnText = isAuthenticating ? <Spinner /> : "Login to your account";

  return (
    <div className="py-5">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="d-flex flex-column gap-4 mx-auto"
      >
        <div className="position-relative">
          <input
            className={`w-100 p-2 custom-bg-dark-gray ${
              errors.email ? "border-danger" : ""
            }`}
            type="text"
            placeholder="Email Address"
            {...register("email", { required: true })}
          />
          {errors.email && (
            <span className=" position-absolute bottom-0 end-0 pb-2">
              Can't be empty
            </span>
          )}
        </div>
        <div className=" position-relative">
          <input
            className={`w-100 p-2 custom-bg-dark-gray ${
              errors.password ? "border-danger" : ""
            }`}
            type="password"
            placeholder="Password"
            {...register("password", { required: true })}
          />
          {errors.password && (
            <span className=" position-absolute bottom-0 end-0 pb-2">
              Can't be empty
            </span>
          )}
        </div>
        <button
          disabled={isAuthenticating}
          className="btn py-2 bg-danger text-white border-0"
        >
          {btnText}
        </button>
      </form>

      <p className="pt-3">
        Don't have an account?
        <Link
          to="/signup"
          className="custom-text-red text-decoration-none ps-2"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default SignIn;
