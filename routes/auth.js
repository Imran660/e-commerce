const express = require("express");
const { createOrUpdateUser, currentUser } = require("../controllers/auth");
const { checkUser, checkAdmin } = require("../middlewares/auth");

const Router = express.Router();


Router.post("/create-or-update-user", checkUser, createOrUpdateUser);
Router.post("/currentUser", checkUser, currentUser)
Router.post("/currentAdmin",checkUser,checkAdmin,currentUser)

module.exports = Router;