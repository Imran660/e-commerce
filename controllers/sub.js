const Sub = require("../modals/sub");
const slugify = require("slugify");
exports.create = async (req, res) => {
  try {
    const sub = await new Sub({
      ...req.body,
      slug: slugify(req.body.name),
    }).save();
    res.status(201).send(sub);
  } catch (err) {
    console.log(err);
    res.status(500).send("something wents wrong");
  }
};
exports.read = async (req, res) => {
  try {
    const sub = await Sub.findOne({ slug: req.params.slug }).exec();
    res.send(sub);
  } catch (err) {
    console.log(err);
    res.status(500).send("something wents wrong");
  }
};
exports.list = async (req, res) => {
  try {
    const subs = await Sub.find({}).exec();
    res.send(subs);
  } catch (err) {
    console.log(err);
    res.status(500).send("something wents wrong");
  }
};
exports.update = async (req, res) => {
  try {
    const sub = await Sub.findOneAndUpdate(
      { slug: req.params.slug },
      { ...req.body, slug: slugify(req.body.name) },
      { new: true }
    );
    res.send(sub);
  } catch (err) {
    console.log(err);
    res.status(500).send("something wents wrong");
  }
};
exports.remove = async (req, res) => {
  try {
    const sub = await Sub.findOneAndDelete({ slug: req.params.slug });
    res.send(sub);
  } catch (err) {
    console.log(err);
    res.status(500).send("something wents wrong");
  }
};
