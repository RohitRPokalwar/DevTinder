import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addConnections, removeConnection } from '../utils/connectionSlice';
import { Link } from 'react-router-dom';

const Connections = () => {
    const dispatch = useDispatch();
    const connections = useSelector((store) => store.connections);
    const [suggestions, setSuggestions] = useState([]);

    const fetchConnections = async () => {
        try {
            const res = await axios.get("/api/user/Allconnections", {
                withCredentials: true,
            })
            dispatch(addConnections(res.data));
        } catch (err) {
            dispatch(addConnections([]));
        }
    }

    const fetchSuggestions = async () => {
        try {
            const res = await axios.get("/api/user/mutual-connections", {
                withCredentials: true,
            });
            setSuggestions(res.data);
        } catch (err) {
            console.error("Error fetching mutual connection suggestions:", err);
        }
    };

    const sendConnectRequest = async (toUserId) => {
        try {
            await axios.post(`/api/request/send/interested/${toUserId}`, {}, {
                withCredentials: true,
            });
            // Remove the user from suggested list
            setSuggestions((prev) => prev.filter((user) => user._id !== toUserId));
        } catch (err) {
            console.error("Error sending connection request:", err);
        }
    };

    useEffect(() => {
        fetchConnections();
        fetchSuggestions();
    }, [])

    if (!connections) return null;

    return (
        <div className="flex flex-col items-center my-10 gap-10">
            {/* Connections Section */}
            <div className="flex flex-col items-center gap-6 w-full">
                <h1 className="text-3xl font-extrabold text-primary">Your Connections</h1>
                {connections.length === 0 ? (
                    <div className="alert alert-info max-w-md shadow-md text-center mt-4">
                        <span>No active connections yet. Start swiping on the feed to find matches!</span>
                    </div>
                ) : (
                    <div className="flex flex-wrap justify-center gap-6 max-w-6xl w-full px-4">
                        {connections.map((connection) => (
                            <div key={connection._id} className="card bg-base-200 w-92 shadow-xl hover:shadow-2xl transition-all duration-300">
                                <figure className="relative">
                                    <img
                                        src={connection.photoUrl}
                                        alt="Profile"
                                        className="h-60 w-full object-cover"
                                    />
                                    {connection.isPremium && (
                                        <div className="absolute top-2 right-2 badge badge-warning gap-1">⭐ Premium</div>
                                    )}
                                </figure>
                                <div className="card-body">
                                    <h2 className="card-title text-2xl">
                                        {connection.firstName} {connection.lastName}
                                    </h2>
                                    <p className="text-base-content/75 text-sm">{connection.about}</p>
                                    <div className="mt-2">
                                        <h3 className="font-bold text-sm opacity-80">Skills</h3>
                                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                                            {connection.skills && connection.skills.map((skill, index) => (
                                                <div key={index} className="badge badge-outline badge-sm">{skill}</div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="card-actions justify-end mt-4">
                                        <Link to={`/chat/${connection._id}`}>
                                            <button
                                                className="btn btn-secondary btn-sm"
                                            >
                                                Chat
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Suggested Connections (Mutual Connections) Section */}
            {suggestions.length > 0 && (
                <div className="flex flex-col items-center gap-6 w-full border-t border-base-300 pt-10 mt-6">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-secondary">People You May Know</h2>
                        <p className="text-base-content/60 text-sm mt-1">Suggested based on your mutual connections</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-6 max-w-6xl w-full px-4">
                        {suggestions.map((user) => (
                            <div key={user._id} className="card bg-base-200 w-92 shadow-xl hover:shadow-2xl transition-all duration-300">
                                <figure className="relative">
                                    <img
                                        src={user.photoUrl}
                                        alt="Profile"
                                        className="h-60 w-full object-cover"
                                    />
                                    {user.isPremium && (
                                        <div className="absolute top-2 right-2 badge badge-warning gap-1">⭐ Premium</div>
                                    )}
                                </figure>
                                <div className="card-body flex flex-col justify-between">
                                    <div>
                                        <h2 className="card-title text-2xl">
                                            {user.firstName} {user.lastName}
                                        </h2>
                                        <p className="text-base-content/75 text-sm min-h-[40px]">{user.about}</p>

                                        {user.mutualConnections && user.mutualConnections.length > 0 && (
                                            <div className="mt-2 p-2.5 bg-base-300/40 rounded-lg border border-base-300/60">
                                                <p className="text-xs font-semibold text-base-content/70">
                                                    👥 Mutual connections:
                                                </p>
                                                <p className="text-xs text-secondary font-medium mt-0.5">
                                                    {user.mutualConnections.join(", ")}
                                                </p>
                                            </div>
                                        )}

                                        <div className="mt-3">
                                            <h3 className="font-bold text-sm opacity-80">Skills</h3>
                                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                                                {user.skills && user.skills.map((skill, index) => (
                                                    <div key={index} className="badge badge-outline badge-sm">{skill}</div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-actions justify-end mt-4">
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => sendConnectRequest(user._id)}
                                        >
                                            Connect
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Connections;