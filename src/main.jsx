import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./App.css";
import { BrowserRouter } from "react-router-dom";

import ChatStateProvider from "./context/chatState.jsx";
import { ChakraProvider } from "@chakra-ui/react";

export const server = "https://chat-app-zz8c.onrender.com";
export const config = {
  "Content-Type": "application/json",
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ChatStateProvider>
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </ChatStateProvider>
    </BrowserRouter>
  </React.StrictMode>
);
