import React, { useState } from "react";
import { ChatState } from "../context/chatState";
import { Box } from "@chakra-ui/react";
import { useNavigate } from "react-router";
import SideDrawer from "./miscellaneous/SideDrawer";
import ChatBox from "./miscellaneous/ChatBox";
import MyChats from "./miscellaneous/MyChats";

const Chatpage = () => {
  const context = ChatState();
  const { setRefresh, refresh, user } = context;
  const [fetchAgain, setFetchAgain] = useState(false);
  const click = () => {
    localStorage.removeItem("user");
    setRefresh(true);
  };
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        mt={2}
        w="100%"
        h="90vh"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chatpage;
