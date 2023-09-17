import React, { useContext, useState } from "react";
import { VStack, Text } from "@chakra-ui/react";
import {
  Button,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  Input,
} from "@chakra-ui/react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { server } from "../main";
import { chatContext } from "../context/chatState";

const Login = () => {
  const context = useContext(chatContext);
  const { refresh, isAuthenticated, setRefresh, setIsAuthentiacted } = context;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const shower = () => {
    setShow(!show);
  };

  const navigate = useNavigate();
  const submitHandler = async () => {
    if (!email || !password) {
      toast.error("Please Fill All the Fields");
      return;
    }

    try {
      const response = await fetch(`${server}/api/v1/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message);
      }
      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        toast.success("Logged in Succesfully");
      }
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };
  return (
    <VStack spacing="5px">
      <FormControl id="email" isRequired rowgap={3}>
        <FormLabel>Email</FormLabel>
        <Input
          type={"email"}
          plceholder="Enter Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></Input>
      </FormControl>
      <FormControl id="password" mt="1rem" isRequired rowgap={3}>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Input>
          <InputRightElement w="4.5rem">
            <Button h="1.75rem" sm="lg" pr={2} onClick={shower}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button w="100%" colorScheme="blue" mt="15px" onClick={submitHandler}>
        Log in
      </Button>
      <Button
        variant="solid"
        colorScheme="red"
        w="100%"
        onClick={() => {
          setEmail("guest123@mail.com");
          setPassword("123456");
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
