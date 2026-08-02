import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addRequests, removeRequests } from '../utils/requestSlice';

function Requests() {
    const dispatch = useDispatch();
    const requests = useSelector((store) => store.requests);

    const getRequests = async () => {
        try {
            const res = await axios.get("/api/user/connections/recived", {
                withCredentials: true,
            })
            dispatch(addRequests(res.data));
        } catch (err) {
            dispatch(addRequests([]));
        }
    }

    const reviewRequest = async (status, requestId) => {
        try {
            await axios.post(`/api/request/review/${status}/${requestId}`, {}, {
                withCredentials: true,
            });
            dispatch(removeRequests(requestId));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getRequests();
    }, [])

    if (!requests) return null;

    if (requests.length === 0) return <h1 className="flex justify-center text-2xl my-10">No Requests Found</h1>;

    return (
        <div className="flex flex-col items-center my-10 gap-6">
            <h1 className="text-2xl font-bold">Requests</h1>
            {requests.map((request) => {
                const sender = request.fromUserId;
                return (
                    <div key={request._id} className="card bg-base-200 w-96 shadow-xl">
                        <figure>
                            <img
                                src={sender.photoUrl}
                                alt="Profile"
                                className="h-60 w-full object-cover"
                            />
                        </figure>
                        <div className="card-body">
                            <h2 className="card-title text-2xl">{sender.firstName} {sender.lastName}</h2>
                            <p>{sender.about}</p>
                            <div className="mt-2">
                                <h3 className="font-bold">Skills</h3>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {sender.skills && sender.skills.map((skill, index) => (
                                        <div key={index} className="badge badge-primary">{skill}</div>
                                    ))}
                                </div>
                            </div>
                            <div className="card-actions justify-between mt-6">
                                <button className="btn btn-error" onClick={() => reviewRequest("rejected", request._id)}>Reject</button>
                                <button className="btn btn-success" onClick={() => reviewRequest("accepted", request._id)}>Accept</button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    )
}

export default Requests