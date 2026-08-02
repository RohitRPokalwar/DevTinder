import axios from 'axios';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router';
import { removeUser } from '../utils/userSlice';

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      await axios.post("/api/logout",
        {}, {
        withCredentials: true,
      });
      dispatch(removeUser());
      return navigate("/login");
    } catch (err) {

    }
  }
  return (
    <div className="navbar bg-base-200 shadow-sm">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">DEVTinder</Link>
      </div>
      <div className="flex gap-2">
        {user && <div className="dropdown dropdown-end flex ">
          <p>Welcome , {user.firstName}</p>
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img
                alt="User Photo"
                src={user.photoUrl} />
            </div>
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
            <li>
              <Link to="/profile" className="justify-between">
                Profile
                <span className="badge">New</span>
              </Link>
            </li>
            <li>
              <Link to="/connections" className="justify-between">
                Connections
              </Link>
            </li>
            <li>
              <Link to="/requests" className="justify-between">
                Requests
              </Link>
            </li>
            <li><a>Settings</a></li>
            {user?.isAdmin && (
              <li>
                <Link to="/admin" className="justify-between">
                  Admin Panel
                </Link>
              </li>
            )}
            <li>
              <button onClick={handleLogOut}>Logout</button>
            </li>
          </ul>
        </div>
        }
      </div>
    </div>
  )
}

export default Navbar;