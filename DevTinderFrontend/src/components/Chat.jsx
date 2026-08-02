import React from 'react'
import { useParams } from 'react-router-dom';
import { createSocketConnection } from '../utils/chat';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
const Chat = () => {
    const {targetUserId} = useParams();
    const [messages, setMessages] = React.useState([
        {text: "Hello! How are you?"},
        {text: "I'm good, thanks! How about you?"},
        {text: "I'm doing well too."},
    ]);

    const [newMessage, setNewMessage] = React.useState("");
    const user = useSelector((store) => store.user);
const userId = user?._id;

    useEffect(() => {
        if (!userId || !targetUserId) return;
        // Initialize socket connection here
        const socket = createSocketConnection();

       socket.emit('joinRoom', {firstName : user.firstName , userId ,  targetUserId });
        return ()=>{
            socket.disconnect();
        };

    }, [userId, targetUserId]);

    const handleSendMessage = (message) => {
        // Send message to the server
        const socket = createSocketConnection();
        socket.emit('sendMessage', { targetUserId, message });
    };

    const sendMessage = () => {
        const socket=createSocketConnection();
        const userId = user?._id;
      socket.emit('sendMessage' , {userId , targetUserId , newMessage});
    };


   return (
  <div className="w-1/2 mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col">
    <h1 className="p-5 border-b border-gray-600">Chat</h1>

    <div className="flex-1 overflow-scroll p-5">
      {messages.map((msg, index) => {
        return (
          <div key={index}>
            {msg.text}
          </div>
        );
      })}
    </div>

    <div className="p-5 border-t border-gray-600 flex items-center gap-2">
      <input value={newMessage}
      onChange={(e) => setNewMessage(e.target.value)}
        className="flex-1 border border-gray-500 text-white rounded p-2"
      />
      <button onClick={sendMessage} className="btn btn-secondary">
        Send
      </button>
    </div>
  </div>
);
}

export default Chat