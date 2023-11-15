const Joi = require("joi");

const employeeSchema = Joi.object({
  employeeName: Joi.string().required(),
  designation: Joi.string().required(),
  department: Joi.string().required(),
  dateOfJoining: Joi.string().required(),
  contactNo: Joi.number().required(),
  personalEmail: Joi.string().email().required(),
  officialEmail: Joi.string().email().required(),
});

module.exports = {
  employeeSchema,
};
