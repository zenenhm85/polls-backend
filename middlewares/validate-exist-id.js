const mongoose = require("mongoose");

const User = require("../models/users.model");

const validateUserId = async (req, res, next) => {
  const userId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      ok: false,
      message: "Malformed Mongo ID",
    });
  }

  const userDB = await User.findById(userId);

  if (!userDB) {
    return res.status(400).json({
      ok: false,
      message: "User not found. This id does not exist",
    });
  }

  next();
};

module.exports = {
  validateUserId,
};
