const { response, request } = require("express");

const Poll = require("../models/polls.model");
const UserPoll = require("../models/user-poll.model");

/*==========================================================
POST
===========================================================*/
const createPoll = async (req = request, res = response) => {
  try {
    const poll = new Poll(req.body);

    await poll.save();

    res.status(200).json({
      ok: true,
      poll,
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
const getPolls = async (req = request, res = response) => {
  try {
    const start = Number(req.query.start) || 0;
    const limit = Number(req.query.limit) || 5;

    let polls =[] ;
    let total = 0;
    
    if(req.query.start && req.query.limit){
      [polls, total] = await Promise.all([
        Poll.find().skip(start).limit(limit),
        Poll.countDocuments(),
      ]);
    }
    else{
      [polls, total] = await Promise.all([
        Poll.find(),
        Poll.countDocuments(),
      ]);
    } 

    return res.status(200).json({
      ok: true,
      total,
      polls,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Unexpected server error",
      errors: error,
    });
  }
};

/*==========================================================
PUT
===========================================================*/
const updatePoll = async (req = request, res = response) => {
  const pid = req.params.id;
  try {
    const fields = req.body;

    const updatedPoll = await Poll.findByIdAndUpdate(pid, fields, {
      new: true,
    });

    await UserPoll.updateMany({poll:pid},{edited:true});

    return res.json({
      ok: true,
      poll: updatedPoll,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message,
      errors: error,
    });
  }
};

/*==========================================================
DELETE
===========================================================*/
const deletePoll = async (req = request, res = response) => {
  const pid = req.params.id;

  try {
    await Poll.findByIdAndDelete(pid);
    await UserPoll.deleteMany({"poll":pid});

    return res.json({
      ok: true,
      message: "Poll deleted successfully",
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
  createPoll,
  getPolls,
  updatePoll,
  deletePoll
};
