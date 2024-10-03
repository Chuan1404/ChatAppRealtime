import express from 'express';
import authController from '../controllers/AuthController';
import upload from '../configs/multer'

const router = express.Router();

router.post("/sign-up", upload.single("avatar"), authController.signUp);
router.post("/sign-in", authController.signIn);
router.post("/refresh-token", authController.refreshToken);

export default router