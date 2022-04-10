const express = require("express");
const { read, update, create, remove, list } = require("../controllers/sub");
const { checkUser, checkAdmin } = require("../middlewares/auth");
const Router = express.Router();

//routes
Router.post("/sub", checkUser, checkAdmin, create);
Router.get("/subs", list);
Router.get("/sub/:slug", read);
Router.put("/sub/:slug", checkUser, checkAdmin, update);
Router.delete("/sub/:slug", checkUser, checkAdmin, remove);

module.exports = Router;
