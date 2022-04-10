const express = require("express");
const { create, remove } = require("../controllers/cloudinary");
const { checkUser, checkAdmin } = require("../middlewares/auth");
const Router = express.Router();

//routes
Router.post("/uploadimages", checkUser, checkAdmin, create);
Router.post("/removeimages", checkUser, checkAdmin, remove);

module.exports = Router;
