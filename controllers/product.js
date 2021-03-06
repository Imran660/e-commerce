const { default: slugify } = require("slugify");
const Product = require("../modals/product");
const Sub = require("../modals/sub");
const User = require("../modals/user");
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
exports.remove = (req, res) => {
  Product.findOneAndDelete({ slug: req.params.slug }, (err, data) => {
    if (err) {
      res.status(500).json({
        error: err.message,
      });
    }
    res.status(200).send(data);
  });
};
exports.update = (req, res) => {
  Product.findOneAndUpdate(
    { slug: req.params.slug },
    { ...req.body, slug: slugify(req.body.title) },
    { new: true },
    (err, data) => {
      if (err) {
        res.status(500).json({
          error: err.message,
        });
      }
      res.status(200).send(data);
    }
  );
};
exports.read = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate("category")
    .populate("subs")
    .exec();
  res.json({
    ...product._doc,
    selectedSubs: product.subs,
  });
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

exports.handleRating = async (req, res) => {
  try {
    //find a product by id
    const product = await Product.findById(req.params.id).exec();
    // find a user who has given the reating
    const user = await User.findOne({ email: req.user.email }).exec();
    const { star } = req.body;
    // check if the user has already given the rating, if user added the rating then we update the rating otherwise will add
    let existingRating = product.ratings.find(
      (rating) => rating.postedBy.toString() === user._id.toString()
    );
    if (existingRating) {
      //updating star into ratings array
      const ratingUpdated = await Product.updateOne(
        {
          ratings: { $elemMatch: existingRating },
        },
        { $set: { "ratings.$.star": star } },
        { new: true }
      ).exec();
      res.json(ratingUpdated);
    } else {
      //adding new rating into the ratings array
      const ratingAdded = await Product.updateOne(
        { _id: req.params.id },
        {
          $push: {
            ratings: {
              postedBy: user._id,
              star,
            },
          },
        },
        { new: true }
      ).exec();
      res.json(ratingAdded);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};

exports.getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).exec();
    const categoryId = product.category;
    const products = await (
      await Product.find({ category: categoryId }).exec()
    ).filter((product) => product._id.toString() !== req.params.id);
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};

const handleQuery = async (req, res, query) => {
  const products = await Product.find({ $text: { $search: query } })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .exec();
  res.json(products);
};
const handlePriceQuery = (req, res, price) => {
  Product.find({ price: { $gte: price[0], $lte: price[1] } })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .exec((err, products) => {
      if (err) {
        res.status(500).json({
          error: err.message,
        });
      }
      res.json(products);
    });
};
const handleQueryFilter = (req, res, name, value) => {
  Product.find({ [name]: value })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .exec((err, products) => {
      if (err) {
        res.status(500).json({
          error: err.message,
        });
      }
      res.json(products);
    });
};
const handleQuerySubs = (req, res, sub) => {
  Product.find({ subs: { $in: sub._id } })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .exec((err, products) => {
      if (err) {
        res.status(500).json({
          error: err.message,
        });
      }
      res.json(products);
    });
};
const handleStarsRating = (req, res, star) => {
  Product.find({ ratings: { $elemMatch: { star } } })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .exec((err, products) => {
      if (err) {
        res.status(500).json({
          error: err.message,
        });
      }
      res.json(products);
    });
};
exports.getFilteredProducts = async (req, res) => {
  try {
    const { query, price, category, stars, color, brand, subs, shipping } =
      req.body;
    if (query) {
      console.log(query);
      await handleQuery(req, res, query);
    }
    if (price) {
      console.log(price);
      await handlePriceQuery(req, res, price);
    }
    if (category) {
      console.log(category);
      await handleQueryFilter(req, res, "category", category);
    }
    if (subs) {
      console.log(subs);
      await handleQuerySubs(req, res, subs);
    }
    if (stars) {
      console.log(stars);
      await handleStarsRating(req, res, stars);
    }
    if (color) {
      console.log(color);
      await handleQueryFilter(req, res, "color", color);
    }
    if (brand) {
      console.log(brand);
      await handleQueryFilter(req, res, "brand", brand);
    }
    if (shipping) {
      console.log(shipping);
      await handleQueryFilter(req, res, "shipping", shipping);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};