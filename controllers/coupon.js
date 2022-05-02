const Coupon = require("../modals/coupon");

exports.create = async (req, res) => {
  try {
    const { name, discount, expiry } = req.body;
    const coupon = await new Coupon({ name, discount, expiry }).save();
    res.json(coupon);
  } catch (err) {
    console.log(err);
  }
};
exports.list = (req, res) => {
  Coupon.find({}, (err, result) => {
    if (err) {
      res.status.send(err);
    }
    res.json(result);
  });
};
exports.remove = async (req, res) => {
  try {
    const coupon = await Coupon.findOneAndDelete({
      name: req.params.name,
    }).exec();
    res.send("coupon deleted");
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};
