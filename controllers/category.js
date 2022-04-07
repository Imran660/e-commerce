const Category = require("../modals/category");
const slugify = require("slugify");
exports.create = async (req, res) => {
  try {
    const category = await new Category({
      ...req.body,
      slug: slugify(req.body.name),
    }).save();
    res.status(201).send(category);
  } catch (err) {
    console.log(err);
    res.status(500).send("something wents wrong");
  }
};
exports.read = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug }).exec();
    res.send(category);
  } catch (err) {
    console.log(err);
    res.status(500).send("something wents wrong");
  }
};
exports.list = async (req, res) => {
  try {
    const categories = await Category.find({}).exec();
    res.send(categories);
  } catch (err) {
    console.log(err);
    res.status(500).send("something wents wrong");
  }
};
exports.update = async (req, res) => {
  try {
    const category = await Category.findOneAndUpdate(
      { slug: req.params.slug },
      { ...req.body, slug: slugify(req.body.name) },
      { new: true }
      );
      res.send(category);
  } catch (err) {
    console.log(err);
    res.status(500).send("something wents wrong");
  }
};
exports.remove = async(req, res) => {
    try {
        const category =await Category.findOneAndDelete({ slug: req.params.slug });
        res.send(category);
  } catch (err) {
    console.log(err);
    res.status(500).send("something wents wrong");
  }
};
