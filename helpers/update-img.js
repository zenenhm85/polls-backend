const { request, response } = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const User = require("../models/users.model");

const deleteImg = (path) => {
  if (fs.existsSync(path)) {
    // delete previous img
    fs.unlinkSync(path);
  }
};

const updateImg = async (id, fileName) => {
  let pathOld = "";

  const userDB = await User.findById(id);

  if (!userDB) {
    console.log("Not a user by id");
    return false;
  }

  pathOld = `./uploads/users/${userDB.img}`;
  deleteImg(pathOld);

  userDB.img = fileName;
  await userDB.save();
  return true;
};

const uploadImg = async (req = request, res = response) => {
  const id = req.params.id;
  const file = req.files.img;

  const cutName = file.name.split(".");
  const fileExtension = cutName[cutName.length - 1];

  // Generate file name
  const fileName = `${uuidv4()}.${fileExtension}`;

  // Path to save the image
  const path = `./uploads/users/${fileName}`;

  // Move img
  file.mv(path, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        ok: false,
        message: "Failed to move image",
      });
    }

    // Update database
    updateImg(id, fileName);

    res.json({
      ok: true,
      message: "File uploaded!!",
      fileName,
    });
  });
};

module.exports = {
  uploadImg,
};
