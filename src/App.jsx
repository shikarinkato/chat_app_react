import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Chatpage from "./components/Chatpage";
import { Toaster } from "react-hot-toast";

// import { Socket } from "socket.io-client";
// const ENDPOINT = "http://localhost:5000";
// const socket = io(ENDPOINT, { transports: ["websocket"] });


function App() {
  return (
    <div className="bg-gray-700 w-screen h-screen ">
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/chats" element={<Chatpage />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
