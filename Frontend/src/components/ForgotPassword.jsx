import React, { useState } from "react";
import axios from "axios";

function ForgotPassword() {
  const [emailId, setEmailId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleForgotPassword = async () => {
    try {
      setErrorMessage("");
      setSuccessMessage("");
      const res = await axios.post(
        "/api/forgot-password",
        { emailId },
        { withCredentials: true }
      );
      setSuccessMessage(res.data.message);
    } catch (err) {
      setErrorMessage(err.response?.data || "Failed to send reset email");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-base-200">
      <div className="card bg-base-100 w-96 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl">
            Forgot Password
          </h2>
          <p className="text-center text-sm">
            Enter your email and we'll send you a reset link.
          </p>
          <fieldset className="fieldset">
            <label className="label" htmlFor="email">
              Email ID
            </label>
            <input
              type="email"
              id="email"
              className="input input-bordered w-full"
              placeholder="Enter Email"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
            />
          </fieldset>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          {successMessage && (
            <p className="text-green-500">{successMessage}</p>
          )}
          <div className="card-actions mt-5">
            <button
              className="btn btn-primary w-full"
              onClick={handleForgotPassword}
            >
              Send Reset Link
            </button>
          </div>
          <p className="text-center mt-3">
            <a href="/login" className="text-primary cursor-pointer underline">
              Back to Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
