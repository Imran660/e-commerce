const express = require("express");
const router = express.Router();
const { checkUser, checkAdmin } = require("../middlewares/auth");
const { create, list, remove } = require("../controllers/coupon");

router.post("/coupon", checkUser, checkAdmin, create);
router.get("/coupons", checkUser, checkAdmin, list);
router.delete("/coupon/:name", checkUser, checkAdmin, remove);

module.exports = router;
