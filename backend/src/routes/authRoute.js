const express = require("express");
const router = express.Router();
const authController = require("../controllers/AuthController");
const upload = require("../configs/multer");

router.post("/sign-up", upload.single("avatar"), authController.signUp);
router.post("/sign-in", authController.signIn);
router.post("/refresh-token", authController.refreshToken);

module.exports = router;
