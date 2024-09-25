const express = require("express");
const app = express();
const cors = require('cors')
const dotenv = require('dotenv')
const http = require("http");
const server = http.createServer(app);
const multer = require('multer');
const bodyParser = require('body-parser')

const PORT = 3001;

// middlewares
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('src/public'))

// config
const database = require("./src/configs/database")
const socket = require("./src/configs/socket")

dotenv.config()
database.connect()
socket.init(server)

// routes
const router = require("./src/routes");
router(app);

server.listen(PORT, () => {
  console.log("Server run success");
});


