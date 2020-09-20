const mongoose = require("mongoose");

const User = require("../models/users.model");

const validateUserExistAndActive = async (req, res, next) => {
  const { email } = req.body;

  const userDB = await User.findOne({ email });

  if (!userDB) {
    return res.status(404).json({
      ok: false,
      message: "Invalid user or password",
    });
  }
  if (!userDB.active) {
    return res.status(404).json({
      ok: false,
      message: "Your username is not active",
    });
  }

  next();
};

module.exports = {
  validateUserExistAndActive,
};
