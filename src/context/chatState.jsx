import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";

const chatContext = createContext();

const ChatStateProvider = ({ children }) => {
  const [isAUthenticated, setIsAUthenticated] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState(false);
  const [chats, setChats] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const hii = () => {
    toast.success("Hii");
  };

  const navigate = useNavigate();

  useEffect(() => {
    let userinfo = JSON.parse(localStorage.getItem("user"));
    setUser(userinfo);
    if (userinfo) {
      return navigate("/chats");
    }
    if (!userinfo) {
      return navigate("/");
    }
  }, [navigate, refresh]);

  return (
    <chatContext.Provider
      value={{
        hii,
        refresh,
        setRefresh,
        isAUthenticated,
        setIsAUthenticated,
        user,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </chatContext.Provider>
  );
};
const ChatState = () => {
  return useContext(chatContext);
};
export default ChatStateProvider;
export { chatContext, ChatState };
