import React, { useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import Spinner from "../../utils/Spinner";
import { Link, useNavigate } from "react-router-dom";
import "./SignUp";

const SignUp = () => {
  const { handleSignUp, isAuthenticating, token } = useAuth();
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
    getValues,
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    handleSignUp(data);
  };

  const btnText = isAuthenticating ? <Spinner /> : "Create an account";

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
        <div className=" position-relative">
          <input
            className={`w-100 p-2 custom-bg-dark-gray ${
              errors.rePassword ? "border-danger border-2" : ""
            }`}
            type="password"
            placeholder=" Repeat Password"
            {...register("rePassword", {
              required: true,
              validate: (val) =>
                val == getValues("password") || "Password does not match",
            })}
          />
          {errors.rePassword && errors.rePassword.type === "required" && (
            <span className=" position-absolute bottom-0 end-0 pb-2">
              Can't be empty
            </span>
          )}
          {errors.rePassword && errors.rePassword.type === "validate" && (
            <span className=" position-absolute bottom-0 end-0 pb-2">
              {errors.rePassword.message}
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
        Already have an account?
        <Link
          to="/signin"
          className="custom-text-red text-decoration-none ps-2"
        >
          Login
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
