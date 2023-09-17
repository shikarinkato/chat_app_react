import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../context/chatState";
import toast from "react-hot-toast";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import UserListItem from "../UserAvatar/UserListItem";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchChats }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, selectedChat, setSelectedChat } = ChatState();

  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const handleadduser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast.error("User Already ifn Group");
      return;
    }

    if (selectedChat.GroupAdmin._id !== user._id) {
      toast.error("Admin Can Only Add Or Remove Users");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${server}/api/v1/chat/addtogroup`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          chatID: selectedChat._id,
          userID: user1._id,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setLoading(false);
      }
    } catch (error) {
      toast.error("Failed To Add User");
    }
  };

  const handleRemove = async (user1) => {
    if (selectedChat.GroupAdmin._id !== user._id && user1._id !== user._id) {
      toast.error("Admin Can Only Add Or Remove Users");

      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${server}/api/v1/chat/removed`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          chatID: selectedChat._id,
          userID: user1._id,
        }),
      });
      const data = await response.json();

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      if (response.ok) {
        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        fetchChats();
        setLoading(false);
      }
    } catch (error) {
      toast.error("Failed To Add User");
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);

      const response = await fetch(`${server}/api/v1/chat/grouprename`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          chatID: selectedChat._id,
          chatName: groupChatName,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setRenameLoading(false);
      }
    } catch (error) {
      or(error.message);
      setRenameLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${server}/api/v1/users?search=${query}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error("Failed To Load Search Results");
      }
      // console.log(data);
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toast.error("Some Error Occurred ");
    }
  };

  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="work sans"
            display="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box display="flex" w="100%" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => {
                return (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleRemove(u)}
                  ></UserBadgeItem>
                );
              })}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              ></Input>
              <Button
                variant="solid"
                colorScheme="teal"
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl display="flex">
              <Input
                placeholder="Add Users To Group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              ></Input>
            </FormControl>
            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((user) => {
                return (
                  <UserListItem
                    user={user}
                    key={user._id}
                    handleFunction={() => handleadduser(user)}
                  ></UserListItem>
                );
              })
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
