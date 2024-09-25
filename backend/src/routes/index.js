const authRoute = require('./authRoute')
const userRoute = require('./userRoute')
const chatRoute = require('./chatRoute')

function routes(app) {
    app.use("/auth", authRoute)
    app.use("/user", userRoute)
    app.use("/chat", chatRoute)
}

module.exports = routes