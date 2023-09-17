import {
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { ChatState } from "../../context/chatState";
import { Form } from "react-router-dom";
import { server } from "../../main";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUser, setSelectedUser] = useState([]);
  const [serach, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { chats, setChats, user } = ChatState();

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

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUser) {
      return toast.error("Please Fill All The Fields");
    }

    try {
      setLoading(true);
      //   const response = await fetch(`${server}/api/v1/chat/group`, {
      //     method: "POST",
      //     headers: {
      //       Authorization: `Bearer ${user.token}`,
      //     },
      //     body: JSON.stringify({
      //       name: groupChatName,
      //       users: selectedUser.map((u) => u._id),
      //     }),
      //   });

      //   const data = await response.json();

      //   if (response.ok) {
      //     toast.success("Succesfully Created Group Chat");
      //   }
      //   if (!response.ok) {
      //     toast.error("Failed To Create Group Chat");
      //   }
      //   console.log(data);
      //   onClose();
      toast.success("New Chat is Created");
    } catch (error) {
      toast.error(error + "Some Error Occurred");
    }
  };

  const handleGroup = (usertoAdd) => {
    if (selectedUser.includes(usertoAdd)) {
      return toast.error("User Already Added");
    }
    setSelectedUser([...selectedUser, usertoAdd]);
  };
  const handleDelete = (user) => {
    setSelectedUser(
      selectedUser.filter((selected) => selected._id !== user._id)
    );
  };
  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="work sans"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" alignItems="center" flexDir="column">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              ></Input>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users "
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              ></Input>
            </FormControl>
            <div className="grid grid-cols-3 gap-x-2 py-2 ">
              {selectedUser.map((u) => {
                return (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleDelete(u)}
                  ></UserBadgeItem>
                );
              })}
            </div>
            {loading ? (
              <div>Loading</div>
            ) : (
              searchResult?.slice(0, 4).map((user) => {
                return (
                  <UserListItem
                    user={user}
                    key={user._id}
                    handleFunction={() => handleGroup(user)}
                  ></UserListItem>
                );
              })
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Create Group Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
