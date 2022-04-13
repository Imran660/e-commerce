const express = require("express");
const {
  fetchAll,
  create,
  productsCount,
  listByCount,
  remove,
  update,
  read,
  fetchSubsByCategoryId,
  list,
  handleRating,
  getRelatedProducts,
  getFilteredProducts,
} = require("../controllers/product");
const { checkUser, checkAdmin } = require("../middlewares/auth");
const Router = express.Router();

//get all products
Router.get("/products", checkUser, checkAdmin, fetchAll);
//create product
Router.post("/product", checkUser, checkAdmin, create);
//get products count
Router.get("/product/total", productsCount);
//get products by count
Router.get("/products/:count", listByCount);
//remove product
Router.delete("/product/:slug", checkUser, checkAdmin, remove);
//update product
Router.put("/product/:slug", checkUser, checkAdmin, update);
//read product
Router.get("/product/:slug", read);
//get all the sub-categories based on category id
Router.get("/category/subs/:id", fetchSubsByCategoryId);
//get products by pagination
Router.post("/products", list);
//reviews
Router.put("/product/star/:id", checkUser, handleRating);
//give related products
Router.get("/product/related/:id", getRelatedProducts);
//Filter
Router.post("/product/filter", getFilteredProducts);

module.exports = Router;
