import authRoute from "./authRoute"
import userRoute from "./userRoute"
import chatRoute from "./chatRoute"
import { Application } from "express"

function routes(app: Application) {
    app.use("/auth", authRoute)
    app.use("/user", userRoute)
    app.use("/chat", chatRoute)
}

export default routes