const { response, request } = require("express");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const User = require("../models/users.model");
const { generateJWT } = require("../helpers/jwt");
const { uploadImg } = require("../helpers/update-img");

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

const imageReceive = async (req = request, res = response) => {
  try {
    const imgName = req.params.name;

    let pathImg = `./uploads/users/${imgName}`;

    if (fs.existsSync(pathImg)) {
      return res.sendFile(path.resolve(pathImg));
    }
    return res.sendFile(path.resolve(`./uploads/not-user.png`));
    
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: error.message,
      errors: error,
    });
  }
};

/*==================================================
PUT
====================================================*/
const updateUser = async (req = request, res = response) => {
  const uid = req.params.id;

  try {
    const { password, ...fields } = req.body;

    const updatedUser = await User.findByIdAndUpdate(uid, fields, {
      new: true,
    });

    return res.json({
      ok: true,
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message,
      errors: error,
    });
  }
};

const uploadImgUser = async (req = request, res = response) => {
  try {
    uploadImg(req, res);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message,
      errors: error,
    });
  }
};

/*========================================
DELETE
========================================== */
const deleteUser = async (req = request, res = response) => {
  const uid = req.params.id;

  try {
    await User.findByIdAndDelete(uid);

    return res.json({
      ok: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message,
      errors: error,
    });
  }
};

module.exports = {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  uploadImgUser,
  imageReceive,
};
