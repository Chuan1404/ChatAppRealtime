"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const body_parser_1 = __importDefault(require("body-parser"));
const routes_1 = __importDefault(require("./routes"));
const database_1 = __importDefault(require("./configs/database"));
const socket_1 = __importDefault(require("./configs/socket"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const PORT = 3001;
// middlewares
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json({ limit: "50mb" }));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static(path_1.default.join(__dirname, 'publics')));
// config
dotenv_1.default.config();
database_1.default.connect();
socket_1.default.init(server);
// routes
(0, routes_1.default)(app);
server.listen(PORT, () => {
    console.log("Server run success");
});
