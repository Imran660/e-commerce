const mongoose = require("mongoose");
const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      minlength: [6, "Too short"],
      maxlength: [12, "Too big"],
      uppercase: true,
      required: "Name is require",
    },
    expiry: {
      type: Date,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    applied: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Coupon", couponSchema);
