import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux';
import { addFeed, removeFeed } from '../utils/feedSlice';
import { useEffect } from 'react';
import UserCard from './UserCard';

function Feed() {
  const feed=useSelector((store)=>store.feed)
  const dispatch=useDispatch();

  const getFeed=async()=>{
    try{
      const res=await axios.get("/api/user/feed" , {
        withCredentials:true,
      });
      dispatch(addFeed(res.data));
    }catch(err){
      console.error(err);
    }
  }

  const sendRequest = async (status, toUserId) => {
    try {
      await axios.post(`/api/request/send/${status}/${toUserId}`, {}, {
        withCredentials: true,
      });
    } catch (err) {
      console.error(err);
    }
    dispatch(removeFeed());
  };

  useEffect(()=>{
    getFeed();
  },[dispatch])

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      {feed && feed.length > 0 ? (
        <UserCard user={feed[0]} sendRequest={sendRequest} />
      ) : (
        <h1 className="text-3xl font-bold">No New Users Found</h1>
      )}
    </div>
  );
}

export default Feed;