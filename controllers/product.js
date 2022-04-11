const { default: slugify } = require("slugify");
const Product = require("../modals/product");
const Sub = require("../modals/sub");
exports.fetchAll = (req, res) => {
  Product.find({})
    .populate("category")
    .populate("subs")
    .exec((err, products) => {
      if (err) {
        res.status(500).json({
          error: err.message,
        });
      }
      res.status(200).json({
        products,
      });
    });
};
exports.create = (req, res) => {
  console.log(req.body);
  delete req.body.subs;
  delete req.body.categories;
  const product = new Product({
    ...req.body,
    subs: req.body.selectedSubs,
    slug: slugify(req.body.title),
  });
  product.save((err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        error: err.message,
      });
    }
    res.json({
      data,
    });
  });
};
exports.productsCount = (req, res) => {
  Product.countDocuments({}, (err, count) => {
    if (err) {
      res.status(500).json({
        error: err.message,
      });
    }
    res.json(count);
  });
};
exports.listByCount = (req, res) => {
  Product.find({})
    .limit(parseInt(req.params.count))
    .populate("category")
    .populate("subs")
    .exec((err, data) => {
      if (err) {
        res.status(500).json({
          error: err.message,
        });
      }
      res.status(201).send(data);
    });
};
exports.remove = (req, res) => {};
exports.update = (req, res) => {};
exports.read =async (req, res) => {
 const product= await Product.findOne({ slug: req.params.slug })
    .populate("category")
    .populate("subs")
        .exec()
    res.json({
        ...product._doc,
        selectedSubs: product.subs
 })
};
exports.fetchSubsByCategoryId = (req, res) => {
  Sub.find({ parent: req.params.id }).exec((err, subs) => {
    if (err) {
      res.status(500).json({
        error: err.message,
      });
    }
    res.status(200).send(subs);
  });
};

exports.list = (req, res) => {
  const { sort, page, order } = req.body;
  const currentPage = page || 1;
  const perPage = 3;
  Product.find({})
    .skip((currentPage - 1) * perPage)
    .limit(perPage)
    .sort([[sort, order]])
    .populate("category")
    .populate("subs")
    .exec((err, products) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          error: err.message,
        });
      }
      res.status(200).send(products);
    });
};
