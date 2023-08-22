const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");

router
	.get("/", userController.getAllUsers)
	.post("/", userController.createUser);

module.exports = router;
