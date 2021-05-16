const Joi = require("joi");

const UserSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
  initials: Joi.string().required()
});

module.exports = UserSchema