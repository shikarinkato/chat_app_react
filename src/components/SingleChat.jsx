import React, { useEffect, useState } from "react";
import { ChatState } from "../context/chatState";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getsender, getsenderFull } from "../config/chatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { server } from "../main";
import toast from "react-hot-toast";
import "./style.css";
import ScrollableChat from "./ScrollableChat";
import { io } from "socket.io-client";
import Lottie from "lottie-react";
import animationdata from "../animations/typing.json";

const ENDPOINT = "https://chat-app-zz8c.onrender.com";
let socket;
let selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [message, setMessage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const {
    user,
    selectedChat,
    setSelectedChat,
    notifications,
    setNotifications,
  } = ChatState();
  // console.log(selectedChat);

  const defaultoptions = {
    loop: true,
    autoplay: true,
    animationdata: animationdata,
    renderSettings: {
      preserveAspectRatio: "xMidYmid slice",
    },
  };
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stoptyping", () => setIsTyping(false));
  }, []);

  const fetchChats = async () => {
    if (!selectedChat) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${server}/api/v1/message/${selectedChat._id}`,
        {
          method: "Get",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setMessage(data);
        socket.emit("join chat", selectedChat._id);
      }
      if (!response.ok) {
        toast.error(data.message);
      }

      setLoading(false);
    } catch (error) {
      toast.error(error);
      setLoading(false);
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stoptyping", selectedChat._id);
      try {
        const response = await fetch(`${server}/api/v1/message`, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            content: newMessage,
            chatId: selectedChat._id,
          }),
        });
        const data = await response.json();

        if (response.ok) {
          setNewMessage("");
          setMessage((prev) => [...prev, data]);
          socket.emit("new message", data);
          setFetchAgain(true);
        }
        if (!response.ok) {
          toast.error("Message Sending Failed");
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const typinghandler = async (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lasttypingtime = new Date().getTime();
    let timerlength = 3000;
    setTimeout(() => {
      let timenow = new Date().getTime();
      var timediff = timenow - lasttypingtime;

      if (timediff >= timerlength || typing) {
        socket.emit("stoptyping", selectedChat._id);
      }
    }, timerlength);
  };

 

  useEffect(() => {
    selectedChatCompare = selectedChat;
    fetchChats();

    const handleNewMessageReceived = (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notifications.includes(newMessageReceived)) {
          setNotifications((prevNotifications) => [
            newMessageReceived,
            ...prevNotifications,
          ]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessage((prevMessages) => [...prevMessages, newMessageReceived]);
      }
    };

    socket.on("message received", handleNewMessageReceived);

    return () => {
      socket.off("message received", handleNewMessageReceived);
    };
  }, [selectedChat]);
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            ></IconButton>
            {!selectedChat.isGroupChat ? (
              <>
                {getsender(user, selectedChat.users)}
                <ProfileModal user={getsenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                {
                  <UpdateGroupChatModal
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchChats={fetchChats}
                  ></UpdateGroupChatModal>
                }
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
                size="lg"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={message} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? (
                <div>
                  <Lottie
                    options={defaultoptions}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                ""
              )}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a Message..."
                value={newMessage}
                onChange={typinghandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          h="100%"
        >
          <Text fontSize="3xl" p={3} fontFamily="work sans">
            Click On a User To Start Chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
