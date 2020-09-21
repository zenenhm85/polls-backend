const { response, request } = require("express");

const UserPoll = require("../models/user-poll.model");
const Poll = require("../models/polls.model");

/*==========================================================
POST
===========================================================*/
const createVote = async (req = request, res = response) => {
  try {
    const { poll, user, vote } = req.body;

    const userPollSearch = await UserPoll.findOne({
      $and: [{ user: user }, { poll: poll }],
    });
    const userPollSave = new UserPoll(req.body);

    if (!userPollSearch) {
      await userPollSave.save();
      updateVoteOfPoll(poll, vote);
      return res.status(200).json({
        ok: true,
        userPollSave,
      });
    }
    if(userPollSearch.edited) {
      userPollSearch.vote = vote;
      userPollSearch.edited = false;
      await userPollSearch.save();
      updateVoteOfPoll(poll, vote);

      return res.status(200).json({
        ok: true,
        userPollSave,
      });
     
    }
    return res.status(400).json({
      ok: false,
      message: "Repeated vote!",
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message,
      errors: error,
    });
  }
};

const getUserPoll = async (req = request, res = response) => {
  try {
    const { poll, user} = req.body;

    const result = await UserPoll.findOne({
      $and: [{ user: user }, { poll: poll }],
    });
    if(result){
      return res.status(200).json({
        ok: true,
        id:result.id,
        vote: result.vote,
        edited:result.edited
      });
    }
    return res.status(200).json({
      ok: true,
      id:0,
      vote: '',
      edited:false
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
Auxiliary functions
===========================================================*/
const updateVoteOfPoll = async (pollId, vote) => {
  const pollDB = await Poll.findById(pollId);

  const answers = pollDB.answers;
  let answersModify = await answers.map((item) => {
    if (item.value === vote) {
      item.votes++;
    }
    return item;
  });

  await Poll.findByIdAndUpdate(pollId, { answers: answersModify });
};

module.exports = {
  createVote,
  getUserPoll
};
