import { io } from "socket.io-client"
import { API } from "../constants";
const URL = process.env.NODE_ENV === 'production' ? undefined : API;

export const socket = io(URL).connect();

