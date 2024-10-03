import express from "express"
import userController from "../controllers/UserController"
import authToken from "../utils/authToken"

const router = express.Router()

router.use(authToken)
router.get('/get-info', userController.getInfo)
router.get('/get-list', userController.getList)

export default router
