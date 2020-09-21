const { response, request } = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/users.model");
const { generateJWT } = require("../helpers/jwt");

const loginUser = async (req = request, res = response) => {
  const { email, password } = req.body;

  try {
    const userDB = await User.findOne({ email });
    
    const verifyPassword = await bcrypt.compare(password, userDB.password);

    if (!verifyPassword) {
      return res.status(404).json({
        ok: false,
        message: "Invalid user or password",
      });
    }
    
    let token = await generateJWT(userDB.id);

    return res.status(200).json({
      ok: true,      
      token,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Internal Server Error. Possible Server off',
    });
  }
};

const tokenRenew = async (req = request, res = response) => {
  try {
    const uid = req.uid;

    const token = await generateJWT(uid);

    const userDB = await User.findById(uid);

    res.status(200).json({
      ok: true,
      token,
      user:userDB
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Server unexpected error",
    });
  }
};
const changePassword = async (req = request, res = response) => {
  try {
    const { email, password, password2 } = req.body;

    const userDB = await User.findOne({ email });

    if (!userDB) {
      return res.status(404).json({
        ok: false,
        message: "Invalid user or password",
      });
    }

    const verifyPassword = await bcrypt.compare(password, userDB.password);

    if (!verifyPassword) {
      return res.status(404).json({
        ok: false,
        message: "Invalid user or password",
      });
    }

    const salt = bcrypt.genSaltSync();
    userDB.password = bcrypt.hashSync(password2, salt);
    await userDB.save();   

    return res.status(200).json({
      ok: true,
      message:"Password changed successfully"
    });
    
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Server unexpected error",
    });
  }
};

module.exports = {
  loginUser,
  tokenRenew,
  changePassword
};
