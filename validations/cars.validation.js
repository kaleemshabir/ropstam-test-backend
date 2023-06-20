const Joi = require("joi");
const createCar = {
  body: Joi.object().keys({
    model: Joi.string().required().min(3),
    make: Joi.string().required().min(3),
    registration_no: Joi.string().required().min(3),
    color: Joi.string(),
    category: Joi.string().required(),
  }),
};

const updateCar = {
  body: Joi.object().keys({
    model: Joi.string().min(3),
    make: Joi.string().min(3),
    registration_no: Joi.string().min(3),
    color: Joi.string(),
    category: Joi.string().required(),
  }),
};

const deleteCar = {
  params: Joi.object().keys({
    id: Joi.string(),
  }),
};

const getCars = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    itemsPerPage: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getCar = {
  params: Joi.object().keys({
    id: Joi.string(),
  }),
};

module.exports = {
  createCar,
  getCar,
  updateCar,
  deleteCar,
  getCars,
};
