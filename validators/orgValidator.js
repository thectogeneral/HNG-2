const { check, validationResult } = require('express-validator');

// Validation middleware
exports.validateOrganization = [
  // Validate name: It should be a non-empty string and cannot be null
  check('name')
    .isString()
    .withMessage('Name must be a string')
    .notEmpty()
    .withMessage('Name is required'),

  // Validate description: It should be a string if provided
  check('description')
    .optional()
    .isString()
    .withMessage('Description must be a string if provided'),

  // Handle validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }
    next();
  }
];
