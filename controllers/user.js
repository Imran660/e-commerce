const User = require("../modals/user");
const Cart = require("../modals/cart");
const Product = require("../modals/product");
exports.saveUserCart = async (req, res) => {
  try {
    const { cart } = req.body;
    let products = [];
    const user = await User.findOne({ email: req.user.email }).exec();
    let cartExistByUser = await Cart.findOne({ orderedBy: user._id }).exec();
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
      orderedBy: user._id,
    }).save();
    res.status(201).json(newCart);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};
exports.getUserCart = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).exec();
    const cart = await Cart.findOne({ orderedBy: user._id })
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
    const user = await User.findOne({ email: req.user.email }).exec();
    const cart = await Cart.findOneAndRemove({ orderedBy: user._id }).exec();
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
exports.createOrder = async (req, res) => {};
