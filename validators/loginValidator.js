const Joi = require('joi');

// Define the validation schema
const userSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email is invalid',
    'any.required': 'Email is required'
  }),
  
  password: Joi.string().required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
  }),
});

// Middleware to validate the request body against the schema
exports.validateLogin = (req, res, next) => {
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

