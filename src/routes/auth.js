const express = require("express");
const { registerAuth, loginAuth } = require("../services/auth/account");
const authMiddleware = require("../middleware/auth/account");

const router = express.Router();

// Register Route
router.post("/register/:user_role?", registerAuth);
router.post("/login", loginAuth)
router.get("/protected-route", authMiddleware, loginAuth);
module.exports = router;
