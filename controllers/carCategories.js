const asyncHandler = require("../middleware/asyncHandler");
const CarCategory = require("../models/CarCategory");
const apiError = require("../utils/apiError");
exports.create = asyncHandler(async (req, res) => {
  const { name } = req.body;
  let category = await CarCategory.findOne({ name });
  if (category) {
    throw new apiError(400, "category already exists. try other one");
  }

  category = await CarCategory.create({ name });
  return res.status(201).send(category);
});
exports.getAll = asyncHandler(async (req, res) => {
  const { query } = req;
  const page = query.page ? parseInt(query.page) : 1;
  const itemsPerPage = query.itemsPerPage
    ? parseInt(query.itemsPerPage)
    : query.perPage
    ? parseInt(query.perPage)
    : 10;
  const totalItems = await CarCategory.countDocuments();
  let categories = [];

  categories = CarCategory.find({});
  if (!query.all) {
    categories = categories
      .sort([["createdAt", -1]])
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .lean();
  }
  categories = await categories;

  return res.status(200).send({ categories, totalItems });
});
exports.getOne = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const category = await CarCategory.findById(id).lean();

  return res.status(200).send(category);
});
exports.updateOne = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { name } = req.body;
  let category = await CarCategory.findById(id).lean();
  if (!category) {
    throw new apiError(404, "Category not found with the given id");
  }
  category = await CarCategory.findByIdAndUpdate(
    id,
    {
      name: name,
    },
    {
      new: true,
    }
  );
  return res.status(200).send(category);
});

exports.deleteOne = asyncHandler(async (req, res) => {
  const id = req.params.id;
  let category = await CarCategory.findById(id).lean();
  if (!category) {
    throw new apiError(404, "Category not found with the given id");
  }
  category = await CarCategory.findByIdAndDelete(id);
  return res.sendStatus(204);
});
exports.deleteAll = asyncHandler(async (req, res) => {
  await CarCategory.deleteMany();
  return res.sendStatus(204);
});
