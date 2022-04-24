const express = require("express");
const {
  saveUserCart,
  getUserCart,
  createWishList,
  getWishList,
  removeCart,
  removeFromWishList,
  createOrder,
  saveAddress,
} = require("../controllers/user");
const { checkUser } = require("../middlewares/auth");
const Router = express.Router();
//save user cart
Router.post("/user/cart", checkUser, saveUserCart);
Router.get("/user/cart", checkUser, getUserCart);
Router.delete("/user/cart", checkUser, removeCart);
//wishlist
Router.post("/user/wishlist", checkUser, createWishList);
Router.get("/user/wishlist", checkUser, getWishList);
Router.put("/user/wishlist/:pid", checkUser, removeFromWishList);
//orders
Router.post("/user/address", checkUser, saveAddress);
Router.post("/user/order", checkUser, createOrder);
module.exports = Router;
