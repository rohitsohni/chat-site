import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";


export const ChatContext = createContext();

const MESSAGE_POLL_INTERVAL_MS = 2500;
const USERS_POLL_INTERVAL_MS = 5000;

const haveSameMessages = (currentMessages, nextMessages)=>{
    if(currentMessages.length !== nextMessages.length) return false;

    return currentMessages.every((message, index)=> message._id === nextMessages[index]?._id && message.seen === nextMessages[index]?.seen);
}

const haveSameUnseenMessages = (currentUnseen, nextUnseen)=>{
    const currentKeys = Object.keys(currentUnseen);
    const nextKeys = Object.keys(nextUnseen);

    if(currentKeys.length !== nextKeys.length) return false;

    return currentKeys.every((key)=> currentUnseen[key] === nextUnseen[key]);
}

export const ChatProvider = ({ children })=>{

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null)
    const [unseenMessages, setUnseenMessages] = useState({})

    const {socket, axios, authUser} = useContext(AuthContext);

    // function to get all users for sidebar
    const getUsers = async ({ silent = false } = {}) =>{
        try {
            const { data } = await axios.get("/api/messages/users");
            if (data.success) {
                setUsers(data.users)
                setUnseenMessages((prevUnseenMessages)=> haveSameUnseenMessages(prevUnseenMessages, data.unseenMessages) ? prevUnseenMessages : data.unseenMessages)
            }
        } catch (error) {
            if(!silent) toast.error(error.message)
        }
    }

    // function to get messages for selected user
    const getMessages = async (userId, { silent = false } = {})=>{
        try {
            const { data } = await axios.get(`/api/messages/${userId}`);
            if (data.success){
                setMessages((prevMessages)=> haveSameMessages(prevMessages, data.messages) ? prevMessages : data.messages)
            }
        } catch (error) {
            if(!silent) toast.error(error.message)
        }
    }

    // function to send message to selected user
    const sendMessage = async (messageData)=>{
        try {
            const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            if(data.success){
                setMessages((prevMessages)=>[...prevMessages, data.newMessage])
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // function to subscribe to messages for selected user
    const subscribeToMessages = async () =>{
        if(!socket) return;

        socket.on("newMessage", (newMessage)=>{
            if(selectedUser && newMessage.senderId === selectedUser._id){
                newMessage.seen = true;
                setMessages((prevMessages)=> [...prevMessages, newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`);
            }else{
                setUnseenMessages((prevUnseenMessages)=>({
                    ...prevUnseenMessages, [newMessage.senderId] : prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1
                }))
            }
        })
    }

    // function to unsubscribe from messages
    const unsubscribeFromMessages = ()=>{
        if(socket) socket.off("newMessage");
    }

    useEffect(()=>{
        subscribeToMessages();
        return ()=> unsubscribeFromMessages();
    },[socket, selectedUser])

    useEffect(()=>{
        if(!authUser) return;

        getUsers({ silent: true });
        const intervalId = setInterval(()=> getUsers({ silent: true }), USERS_POLL_INTERVAL_MS);

        return ()=> clearInterval(intervalId);
    },[authUser])

    useEffect(()=>{
        if(!selectedUser) return;

        const intervalId = setInterval(()=> getMessages(selectedUser._id, { silent: true }), MESSAGE_POLL_INTERVAL_MS);

        return ()=> clearInterval(intervalId);
    },[selectedUser])

    const value = {
        messages, users, selectedUser, getUsers, getMessages, sendMessage, setSelectedUser, unseenMessages, setUnseenMessages
    }

    return (
    <ChatContext.Provider value={value}>
            { children }
    </ChatContext.Provider>
    )
}
