const asyncHandler = require("../middleware/asyncHandler");
const Car = require("../models/Car");
const apiError = require("../utils/apiError");
exports.create = asyncHandler(async (req, res) => {
  const { color, model, make, registration_no, category } = req.body;
  let car = await Car.findOne({ registration_no, model });
  if (car) {
    throw new apiError(
      400,
      "already car exists with the same model and registration_no"
    );
  }

  car = await Car.create({ color, model, make, registration_no, category });
  return res.status(201).send(car);
});
exports.getAll = asyncHandler(async (req, res) => {
  const { query } = req;
  const page = query.page ? parseInt(query.page) : 1;
  const itemsPerPage = query.itemsPerPage
    ? parseInt(query.itemsPerPage)
    : query.perPage
    ? parseInt(query.perPage)
    : 10;
  const totalItems = await Car.countDocuments();
  const cars = await Car.find({})
    .populate({
      path: "category",
      select:"name"

    })
    .sort([["createdAt", -1]])
    .skip((page - 1) * itemsPerPage)
    .limit(itemsPerPage)
    .lean();

  return res.status(200).send({ cars, totalItems });
});
exports.getOne = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const car = await Car.findById(id);

  return res.status(200).send(car);
});
exports.updateOne = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { color, model, make, registration_no, category } = req.body;
  let car = await Car.findById(id).lean();
  if (!car) {
    throw new apiError(404, "Car not found with the given id");
  }
  car = await Car.findByIdAndUpdate(
    id,
    {
      color,
      model,
      make,
      registration_no,
      category,
    },
    {
      new: true,
    }
  );
  return res.status(200).send(car);
});

exports.deleteOne = asyncHandler(async (req, res) => {
  const id = req.params.id;
  let car = await Car.findById(id).lean();
  if (!car) {
    throw new apiError(404, "Car not found with the given id");
  }
  car = await Car.findByIdAndDelete(id);
  return res.sendStatus(204);
});
exports.deleteAll = asyncHandler(async (req, res) => {
  await Car.deleteMany();
  return res.sendStatus(204);
});
