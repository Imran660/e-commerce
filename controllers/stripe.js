const Cart = require("../modals/cart");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
exports.createPaymentIntent = async (req, res) => {
  try {
    const { cartTotal, totalAfterDiscount } = await Cart.findOne({
      orderedBy: req.user.email,
    }).exec();
    let finalAmount = cartTotal * 100;
    if (totalAfterDiscount) {
      finalAmount = totalAfterDiscount * 100;
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmount,
      currency: "inr",
    });
    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.log(err);
  }
};
