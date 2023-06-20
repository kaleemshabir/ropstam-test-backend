const mongoose = require("mongoose");
const CarCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CarCategory", CarCategorySchema);
