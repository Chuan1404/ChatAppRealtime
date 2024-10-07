import express, {Application} from "express"
import cors from "cors"
import dotenv from "dotenv"
import http from "http"
import bodyParser from "body-parser"
import router from "./routes"
import database from "./configs/database"
import socket from "./configs/socket"

declare global {
  namespace Express {
    export interface Request {
      userId?: string;
    }
  }
}

const app: Application = express();
const server = http.createServer(app);

const PORT = 3001;

// middlewares
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("publics"));

// config
dotenv.config();
database.connect()
socket.init(server)

// routes
router(app);

server.listen(PORT, () => {
  console.log("Server run success");
});
