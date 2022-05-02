const User = require("../modals/user");
const Cart = require("../modals/cart");
const Product = require("../modals/product");
const Coupon = require("../modals/coupon");
const Order = require("../modals/order");
const { ObjectId } = require("mongoose").Schema;
exports.saveUserCart = async (req, res) => {
  try {
    const { cart } = req.body;
    let products = [];
    let cartExistByUser = await Cart.findOne({
      orderedBy: req.user.email,
    }).exec();
    if (cartExistByUser) {
      cartExistByUser.remove();
      console.log("Cart is removed");
    }

    for (let i = 0; i < cart.length; i++) {
      products.push({
        product: cart[i]._id,
        count: cart[i].count,
        color: cart[i].color,
        price: (await Product.findById(cart[i]._id).select("price").exec())
          .price,
      });
    }

    let cartTotal = products.reduce((acc, curr) => {
      return acc + curr.count * curr.price;
    }, 0);
    console.log({ products, cart });
    let newCart = await new Cart({
      products,
      cartTotal,
      orderedBy: req.user.email,
    }).save();
    res.status(201).json(newCart);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};
exports.getUserCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ orderedBy: req.user.email })
      .populate("products.product")
      .exec();
    res.status(200).json(cart);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};

exports.removeCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndRemove({
      orderedBy: req.user.email,
    }).exec();
    console.log(cart);
    res.send("ok");
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};

exports.createWishList = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { email: req.user.email },
      { $addToSet: { wishlist: req.body.productId } }
    ).exec();
    console.log(user);
    res.send("ok");
  } catch (err) {
    console.log(err);
  }
};

exports.getWishList = async (req, res) => {
  try {
    const wishlist = await User.findOne({ email: req.user.email })
      .select("wishlist")
      .exec();
    console.log(wishlist);
    res.status(200).json(wishlist);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};

exports.removeFromWishList = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { email: req.user.email },
      { $pull: { wishlist: req.params.pid } },
      { new: true }
    )
      .select("wishlist")
      .exec();
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};

exports.saveAddress = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { email: req.user.email },
      { address: req.body.address },
      {
        new: true,
      }
    ).exec();
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
};

exports.applyCoupon = async (req, res) => {
  const { coupon } = req.body;
  const validCoupon = await Coupon.findOne({ name: coupon }).exec();
  console.log(validCoupon);
  if (validCoupon == null) {
    return res.status(400).json({
      err: "Invalid coupon code",
    });
  }
  console.log({ type: typeof req.user.email, email: req.user.email });
  const cartInfo = await Cart.findOne({
    orderedBy: req.user.email.toString(),
  }).exec();
  console.log({ cartInfo });
  let { cartTotal } = cartInfo;

  //calculate the discounted amout
  let totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2);
  await Cart.findOneAndUpdate(
    { orderedBy: req.user.email },
    { totalAfterDiscount },
    { new: true }
  ).exec();
  res.json({ cartTotal, totalAfterDiscount });
};
exports.createOrder = async (req, res) => {
  try {
    const { paymentIntent } = req.body.stripeResponse;
    const { products } = await Cart.findOne({
      orderedBy: req.user.email,
    }).exec();
    let order = await new Order({
      orderedBy: req.user.email,
      products,
      paymentIntent,
    }).save();

    let bulkOptions = products?.map((product) => {
      return {
        updateOne: {
          filter: { _id: product._id },
          update: { $inc: { quantity: -product.count, sold: +product.count } },
        },
      };
    });
    let updateProducts = await Product.bulkWrite(bulkOptions, {});
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      orderedBy: req.user.email,
    })
      .populate("products.product")
      .exec();
    res.status(200).json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};