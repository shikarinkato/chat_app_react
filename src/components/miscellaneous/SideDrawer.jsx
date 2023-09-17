import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { getsender } from "../../config/chatLogics";
import { ChatState } from "../../context/chatState";
import { server } from "../../main";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import ProfileModal from "./ProfileModal";

const SideDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const context = ChatState();
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    refresh,
    setRefresh,
    notifications,
    setNotifications,
  } = context;
  const [search, setSearch] = useState("");
  const [searchresult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const handleSearch = async () => {
    if (!search) {
      toast.error("Please Enter Something To Search");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${server}/api/v1/users?search=${search}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        setSearchResult(data);
      }
      if (!response.ok) {
        toast.error("Some Error Occurred");
      }
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const accessChats = async (id) => {
    try {
      setLoadingChat(true);
      const response = await fetch(`${server}/api/v1/chat/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        credentials: "include",
      });
      const data = await response.json();
      if (!data.find((c) => c._id === data._id)) {
        return setChats([data, ...chats]);
      }
      setSelectedChat(data);
      setLoadingChat(false);
    } catch (error) {
      toast.error("Error in Fetching Chats");
    }
  };
  // console.log(user);

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        bg="white"
        padding="5px 10px 5px 10px"
        borderWidth="10px"
        borderRadius="5px"
      >
        <Tooltip label="search users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <Text m={3} display={{ base: "none", md: "flex" }}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="work sans">
          e-Talk
        </Text>
        <div>
          <Menu>
            <MenuButton padding={1}>
              <BellIcon fontSize="2xl" m={1}></BellIcon>
              <span
                className={
                  !notifications.length
                    ? " hidden"
                    : "flex items-center justify-center relative bottom-[2rem] max-h-[15px] text-white text-[10px] font-semibold max-w-[20px] left-[0.7rem] rounded-full bg-red-600"
                }
              >
                {notifications.length}
              </span>
              <MenuList>
                {!notifications.length && "No New Mesaage Received"}
                {notifications.map((notify) => (
                  <MenuItem
                    key={notify._id}
                    onClick={() => {
                      setSelectedChat(notify.chat),
                        setNotifications(
                          notifications.filter((n) => n !== notify)
                        );
                    }}
                  >
                    {notify.chat.isGroupChat
                      ? ""
                      : `New Message Received from ${getsender(
                          user,
                          notify.chat.users
                        )}`}
                  </MenuItem>
                ))}
              </MenuList>
            </MenuButton>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} padding={1}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem
                onClick={() => {
                  localStorage.removeItem("user"),
                    setRefresh(!refresh),
                    toast.success("Logged out Succesfully");
                }}
              >
                Log Out
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="search users here"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              ></Input>
              <Button onClick={handleSearch}> Search</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchresult?.map((user) => {
                return (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChats(user._id)}
                  />
                );
              })
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
