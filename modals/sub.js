const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const subSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: "Name is required",
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [32, "Name must be less than 32 characters long"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    parent: { type: ObjectId, ref: "Category", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sub", subSchema);
