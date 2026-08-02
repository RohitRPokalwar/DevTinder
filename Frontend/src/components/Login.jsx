import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { addUser } from "../utils/userSlice";

function Login() {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const[errorMessage , setError]=useState("");
  const dispatch=useDispatch();
const navigate=useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "/api/login",
        {
          emailId,
          password,
        },
        {
          withCredentials: true,
        }
      );

      console.log(res.data);
      alert("Login Successful!");
      dispatch(addUser(res.data));
      return navigate("/");
    } catch (err) {
      setError(err.response?.data || "Login Failed");
    }
  };

  const handleSignup = async () => {
    try {
      const res = await axios.post(
        "/api/signup",
        {
          firstName,
          lastName,
          emailId,
          password,
        },
        {
          withCredentials: true,
        }
      );

      console.log(res.data);
      alert("Signup Successful!");
      dispatch(addUser(res.data.data));
      return navigate("/profile");
    } catch (err) {
      setError(err.response?.data || "Signup Failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-base-200">
      <div className="card bg-base-100 w-96 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl">
            {isLoginForm ? "Login" : "Signup"}
          </h2>

          <fieldset className="fieldset">
            {!isLoginForm && (
              <>
                <label className="label" htmlFor="firstName">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  className="input input-bordered w-full"
                  placeholder="Enter First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <label className="label mt-3" htmlFor="lastName">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  className="input input-bordered w-full"
                  placeholder="Enter Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </>
            )}

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

            <label className="label mt-3" htmlFor="password">
              Password
            </label>

            <input
              type="password"
              id="password"
              className="input input-bordered w-full"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </fieldset>
          <p className="text-red-500">{errorMessage}</p>
          <div className="card-actions mt-5">
            <button
              className="btn btn-primary w-full"
              onClick={isLoginForm ? handleLogin : handleSignup}
            >
              {isLoginForm ? "Login" : "Signup"}
            </button>
          </div>
          <p className="text-center mt-3">
            {isLoginForm ? "New to DevTinder?" : "Already have an account?"}{" "}
            <span
              className="text-primary cursor-pointer underline"
              onClick={() => {
                setIsLoginForm(!isLoginForm);
                setError("");
              }}
            >
              {isLoginForm ? "Signup" : "Login"}
            </span>
          </p>
          {isLoginForm && (
            <p className="text-center mt-2">
              <a
                href="/forgot-password"
                className="text-primary cursor-pointer underline text-sm"
              >
                Forgot Password?
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;