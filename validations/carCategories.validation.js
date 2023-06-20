const Joi = require("joi");
const createCategory = {
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

const updateCategory = {
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

const deleteCategory = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

const getCategories = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    itemsPerPage: Joi.number().integer(),
    page: Joi.number().integer(),
    all: Joi.boolean(),
  }),
};

const getCategory = {
  params: Joi.object().keys({
    id: Joi.string(),
  }),
};

module.exports = {
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  getCategories,
};
