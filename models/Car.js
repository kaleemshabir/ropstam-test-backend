const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CarSchema = new mongoose.Schema(
  {
    color: {
      type: String,
    },
    model: {
      type: String,
    },
    make: {
      type: String,
    },
    registration_no: {
      type: String,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "CarCategory",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Car", CarSchema);
