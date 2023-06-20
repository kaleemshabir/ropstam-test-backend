const express = require("express");
const {
  create,
  getOne,
  getAll,
  deleteOne,
  deleteAll,
  updateOne,
} = require("../controllers/carCategories");
const carCategoriesValidation = require("../validations/carCategories.validation.js");
const { protect } = require("../middleware/auth");
const router = express.Router();
const validate = require("../middleware/validate");

router
  .route("/")
  .post(protect, validate(carCategoriesValidation.createCategory), create)
  .get(protect, validate(carCategoriesValidation.getCategories), getAll)
  .delete(deleteAll);
router
  .route("/:id")
  .get(protect, validate(carCategoriesValidation.getCategory), getOne)
  .patch(protect, validate(carCategoriesValidation.updateCategory), updateOne)
  .delete(protect, deleteOne);

module.exports = router;
