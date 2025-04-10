const Joi = require("joi");

const userSchema = Joi.object({
  username: Joi.string().required().trim(),
  email: Joi.string().email().required().trim(),
  password: Joi.string().required().trim(),
  role: Joi.string().trim(),
});

module.exports = {
  userSchema,
};
