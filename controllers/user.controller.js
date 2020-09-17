const User = require("../models/users.model");
const { generateJWT } = require("../helpers/jwt");
const { response, request } = require("express");
const bcrypt = require("bcryptjs");

/*==========================================================
POST
===========================================================*/
const createUser = async (req = request, res = response) => {
  const { password } = req.body;

  try {
    const user = new User(req.body);

    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    await user.save();

    const token = await generateJWT(user.id);

    res.status(200).json({
      ok: true,
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message,
      errors: error,
    });
  }
};

/*==========================================================
GET
===========================================================*/
const getUsers = async (req = request, res = response) => {
  try {
    const start = Number(req.query.start) || 0;
    const limit = Number(req.query.limit) || 5;

    const [users, total] = await Promise.all([
      User.find({}, "name email role img active").skip(start).limit(limit),
      User.countDocuments(),
    ]);

    return res.status(200).json({
      ok: true,
      total,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Unexpected server error",
      errors: error,
    });
  }
};


module.exports = {
  createUser,
  getUsers,
};
