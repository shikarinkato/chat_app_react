import React, { useContext, useState } from "react";
import { Navigate } from "react-router";
import {
  InputGroup,
  InputRightElement,
  VStack,
  Input,
  FormControl,
  FormLabel,
  Button,
} from "@chakra-ui/react";

import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import { server } from "../main";
import { chatContext } from "../context/chatState";

const SignUp = () => {
  const context = useContext(chatContext);
  const { refresh, isAuthenticated, setRefresh, setIsAuthenticated } = context;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(false);
  const [pic, setPic] = useState(null);
  const [loading, setLoading] = useState(false);

  const shower = () => {
    setShow(!show);
  };

  const postDetails = async (pics) => {
    setLoading(true);

    if (pics === undefined) {
      toast.error("Please Select an Image");
      setLoading(false);
      return;
    }

    if (!pics || !pics.type.startsWith("image/")) {
      toast.error("Please Upload an Image");
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append("file", pics);
    data.append("upload_preset", "Chat-App");
    data.append("cloud_name", "shikarinkato");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/shikarinkato/image/upload`,
        {
          method: "post",
          body: data,
        }
      );

      if (!response.ok) {
        throw new Error("Image upload failed.");
      }
      const jsonData = await response.json();
      setPic(jsonData.url.toString());
      console.log(pic);
      toast.success("Picture Uploaded Succesfully");
      setLoading(false);
    } catch (error) {
      console.error("Error uploading image:", error.message);
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  // To register
  const submitHandler = async () => {
    setLoading(true);

    if (!name || !email || !password) {
      toast.error("All fields Are  Mandatory");
      setLoading(false);
      return;
    }

    if (password !== confirmpassword) {
      toast.error("Both Passwords Needed To Be Same");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${server}/api/v1/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, pic }),
      });
      const data = await response.json();
      console.log(pic)

      if (!response.ok) {
        toast.error(data.message);
      }

      if (response.ok) {
        toast.success(data.message);
        localStorage.setItem("user", JSON.stringify(data));
      }
      setLoading(false);

      navigate("/chats");
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
      setIsAuthenticated(false);
    }
  };
  return (
    <VStack spacing="5px">
      <FormControl id="name" isRequired rowgap={3}>
        <FormLabel>Full Name</FormLabel>
        <Input
          plceholder="Enter Your name"
          onChange={(e) => setName(e.target.value)}
        ></Input>
      </FormControl>
      <FormControl id="email" isRequired rowgap={3}>
        <FormLabel>Email</FormLabel>
        <Input
          type={"email"}
          plceholder="Enter Your email"
          onChange={(e) => setEmail(e.target.value)}
        ></Input>
      </FormControl>
      <FormControl id="password" mt="1rem" isRequired rowgap={3}>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Your password"
            onChange={(e) => setPassword(e.target.value)}
          ></Input>
          <InputRightElement w="4.5rem">
            <Button h="1.75rem" sm="lg" pr={2} onClick={shower}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confirmpassword" mt="1rem" isRequired rowgap={3}>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Your password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Input>
          <InputRightElement w="4.5rem">
            <Button h="1.75rem" sm="lg" pr={2} onClick={shower}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic" mt="1rem" isRequired rowgap={3}>
        <FormLabel>Upload Your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        ></Input>
      </FormControl>

      <Button
        w="100%"
        isLoading={loading}
        colorScheme="blue"
        mt="15px"
        onClick={submitHandler}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;
