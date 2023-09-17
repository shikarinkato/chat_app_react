import React, { useContext, useEffect } from "react";
import { chatContext } from "../context/chatState";
import { useNavigate } from "react-router";
import {
  Tab,
  TabPanel,
  TabPanels,
  TabList,
  Tabs,
  Container,
  Box,
  Text,
} from "@chakra-ui/react";

import Login from "./Login";
import SignUp from "./SignUp";
const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let user = localStorage.getItem("user");
    if (user) {
      return navigate("/chats");
    }
    if (!user) {
      return navigate("/");
    }
  }, [navigate]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        padding={2}
        bg="white"
        m="1rem 2rem"
        w="100%"
        borderRadius="15px"
      >
        <Text fontFamily="Work Sans" fontSize="4xl">
          e-Talk
        </Text>
      </Box>
      <Box padding={4} bg="white" m="1rem 2rem" w="100%" borderRadius="15px">
        <Tabs variant="soft-rounded">
          <TabList mb="1rem" gap>
            <Tab borderWidth="1px" mx={2} w="50%">
              Log in
            </Tab>
            <Tab borderWidth="1px" mx={2} w="50%">
              Sign Up
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Home;
