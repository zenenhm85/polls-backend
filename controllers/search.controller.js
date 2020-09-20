const { response, request } = require("express");

const User = require("../models/users.model");

getUsers = async (req = request, res = response) => {
  const search = req.params.search;
  const limit = Number(req.query.limit) || 5;

  try {
    const regexp = new RegExp(search, "i");

    const users = await User.find({ name: regexp }).limit(limit);

    return res.status(200).json({
      ok: true,
      total: users.length,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Server error",
      errors: error,
    });
  }
};

module.exports = {
  getUsers,
};
