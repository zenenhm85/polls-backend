const mongoose = require("mongoose");

const User = require("../models/users.model");
const Poll = require("../models/polls.model");

const validateUserId = async (req, res, next) => {
  const valid = await validateId(req, "user");

  if (!valid) {
    return res.status(400).json({
      ok: false,
      message: "This id does not exist",
    });
  }

  next();
};
const validatePollId = async (req, res, next) => {
  const valid = await validateId(req, "poll");

  if (!valid) {
    return res.status(400).json({
      ok: false,
      message: "This id does not exist",
    });
  }

  next();
};
const validateVoteIds = async (req, res, next) => {
  const { poll, user, vote } = req.body;

  if (
    !mongoose.Types.ObjectId.isValid(poll) ||
    !mongoose.Types.ObjectId.isValid(user)
  ) {
    return res.status(400).json({
      ok: false,
      message: "Id format incorrect!",
    });
  }
  const userDB = await User.findById(user);

  if(!userDB){
    return res.status(400).json({
      ok: false,
      message: "This User does not exist!"
    });
  }
  const pollDB = await Poll.findById(poll);
  if (!pollDB) {
    return res.status(400).json({
      ok: false,
      message: "This Poll does not exist!"
    });
  }

  next();
};

const validateId = async (req, type) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return false;
  }
  switch (type) {
    case "user": {
      const userDB = await User.findById(id);
      if (!userDB) return false;
      break;
    }
    case "poll": {
      const pollDB = await Poll.findById(id);
      if (!pollDB) return false;
      break;
    }
  }
  return true;
};

module.exports = {
  validateUserId,
  validatePollId,
  validateVoteIds
};
