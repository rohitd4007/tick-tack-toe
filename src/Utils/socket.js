import { io } from "socket.io-client";

const socket = io("https://tick-tack-toe-ws.onrender.com"); // Replace with your backend URL

export default socket;
