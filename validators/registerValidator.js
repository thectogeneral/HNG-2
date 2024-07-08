const Joi = require('joi');

// Define the validation schema
const userSchema = Joi.object({
  firstName: Joi.string().min(2).required().messages({
    'string.base': 'First name must be a string',
    'string.min': 'First name must be at least 2 characters long',
    'any.required': 'First name is required'
  }),
  lastName: Joi.string().min(2).required().messages({
    'string.base': 'Last name must be a string',
    'string.min': 'Last name must be at least 2 characters long',
    'any.required': 'Last name is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email is invalid',
    'any.required': 'Email is required'
  }),
  phone: Joi.string().optional().pattern(/^\d+$/).messages({
    'string.pattern.base': 'Phone number is invalid'
  })
});

// Middleware to validate the request body against the schema
exports.validateRegister = (req, res, next) => {
  const { error } = userSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(422).json({
      errors: error.details.map(err => ({
        field: err.context.key,
        message: err.message
      }))
    });
  }

  next();
};

