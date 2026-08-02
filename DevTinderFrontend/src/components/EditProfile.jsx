import React, { useState } from 'react'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../utils/userSlice';
import UserCard from './UserCard';
import { useNavigate } from 'react-router';

function EditProfile({user}) {
  const dispatch = useDispatch();
  const navigate= useNavigate();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || "");
  const [about, setAbout] = useState(user?.about || "");
  const [skills, setSkills] = useState(user?.skills?.join(", ") || "");
  const [errorMessage, setErrorMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  
  const handleSave = async () => {
    setErrorMessage("");
    try {
      const res = await axios.patch(
        "/api/profile/update",
        { firstName, lastName, photoUrl, about, skills: skills.split(",").map(s => s.trim()).filter(Boolean) },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      setErrorMessage(err.response?.data || "Something went wrong");
    }
  };

  return (
    <div className='flex justify-center mx-10'>
    <div className="flex justify-center items-center min-h-[80vh] mx-10">
      <div className="card bg-base-200 w-96 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl">Edit Profile</h2>

          <fieldset className="fieldset">
            <label className="label" htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              className="input input-bordered w-full"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />

            <label className="label mt-3" htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              className="input input-bordered w-full"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />

            <label className="label mt-3" htmlFor="photoUrl">Photo URL</label>
            <input
              type="text"
              id="photoUrl"
              className="input input-bordered w-full"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
            />

            <label className="label mt-3" htmlFor="about">About</label>
            <textarea
              id="about"
              className="textarea textarea-bordered w-full"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />

            <label className="label mt-3" htmlFor="skills">Skills (comma separated)</label>
            <input
              type="text"
              id="skills"
              className="input input-bordered w-full"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </fieldset>

          <p className="text-red-500">{errorMessage}</p>

          <div className="card-actions mt-5">
            <button className="btn btn-primary w-full" onClick={handleSave}>
              Save Profile
            </button>
          </div>
        </div>
      </div>

      {showToast && (
        <div className="toast toast-bottom toast-end">
          <div className="alert alert-success">
            <span>Profile saved successfully!</span>
          </div>
        </div>
      )}
    </div>
    <UserCard user={{firstName , lastName , photoUrl , about , skills: skills.split(",").map(s => s.trim()).filter(Boolean)}}/>
    </div>
  );
}

export default EditProfile;
