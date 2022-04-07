const express = require("express");
const { read, update,create, remove,list  } = require("../controllers/category");
const { checkUser, checkAdmin } = require("../middlewares/auth");
const Router = express.Router();

//routes
Router.post('/category', checkUser, checkAdmin, create)
Router.get("/categories", list);
Router.get("/category/:slug", read);
Router.put("/category/:slug", checkUser, checkAdmin, update);
Router.delete("/category/:slug", checkUser, checkAdmin, remove);

module.exports=Router