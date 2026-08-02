import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleResetPassword = async () => {
    try {
      setErrorMessage("");
      setSuccessMessage("");

      if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match");
        return;
      }

      const res = await axios.post(
        `/api/reset-password/${token}`,
        { password },
        { withCredentials: true }
      );
      setSuccessMessage(res.data.message + ". Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setErrorMessage(err.response?.data || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-base-200">
      <div className="card bg-base-100 w-96 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl">
            Reset Password
          </h2>
          <fieldset className="fieldset">
            <label className="label" htmlFor="password">
              New Password
            </label>
            <input
              type="password"
              id="password"
              className="input input-bordered w-full"
              placeholder="Enter New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label className="label mt-3" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="input input-bordered w-full"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </fieldset>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          {successMessage && (
            <p className="text-green-500">{successMessage}</p>
          )}
          <div className="card-actions mt-5">
            <button
              className="btn btn-primary w-full"
              onClick={handleResetPassword}
            >
              Reset Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
