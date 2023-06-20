const express = require("express");
const {
  create,
  getOne,
  getAll,
  deleteOne,
  deleteAll,
  updateOne,
} = require("../controllers/cars");
const carsValidation = require("../validations/cars.validation.js");

const router = express.Router();
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");

router
  .route("/")
  .post(protect, validate(carsValidation.createCar), create)
  .get(protect, validate(carsValidation.getCars), getAll)
  .delete(protect, deleteAll);
router
  .route("/:id")
  .get(protect, validate(carsValidation.getCar), getOne)
  .patch(protect, validate(carsValidation.updateCar), updateOne)
  .delete(protect, validate(carsValidation.deleteCar), deleteOne);

module.exports = router;
