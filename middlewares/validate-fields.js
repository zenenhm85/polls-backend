const { validationResult } = require("express-validator");

const validateFields = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      errors: errors.mapped(),
      message: "Fields validation error!",
    });
  }

  next();
};

module.exports = {
  validateFields,
};
