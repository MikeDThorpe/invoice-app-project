const Joi = require("joi");

const itemSchema = Joi.array().items(
  Joi.object().keys({
    name: Joi.string().required(),
    qty: Joi.string().required(),
    price: Joi.string().required(),
  })
);
const invoiceSchema = Joi.object({
  paid: Joi.boolean().required(),
  invoiceTotal: Joi.number().required(),
  invoiceDate: Joi.string().required(),
  paymentTerms: Joi.string().required(),
  description: Joi.string().required(),
  fromStreet: Joi.string().required(),
  fromCity: Joi.string().required(),
  fromPostCode: Joi.string().required(),
  fromCountry: Joi.string().required(),
  clientName: Joi.string().required(),
  clientEmail: Joi.string().required(),
  clientStreet: Joi.string().required(),
  clientCity: Joi.string().required(),
  clientPostCode: Joi.string().required(),
  clientCountry: Joi.string().required(),
  items: itemSchema,
});

module.exports = invoiceSchema;