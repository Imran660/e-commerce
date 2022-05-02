const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const cartSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: ObjectId,
          ref: "Product",
        },
        count: Number,
        color: String,
        price: Number,
      },
    ],
    cartTotal: Number,
    totalAfterDiscount: Number,
    orderedBy: String,
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Cart", cartSchema);
