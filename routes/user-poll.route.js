const { Router } = require("express");
const { check } = require("express-validator");

const { validateFields } = require("../middlewares/validate-fields");
const { validateJWT } = require("../middlewares/validate-jwt");
const { validateVoteIds } = require("../middlewares/validate-exist-id");

const {
  createVote,
  getUserPoll,
} = require("../controllers/user-poll.controller");

const router = Router();

router.post(
  "/result",
  [
    validateJWT,
    check("user", "User's id is required").not().isEmpty(),
    check("poll", "Poll's id is required").not().isEmpty(),
    validateFields,
  ],
  getUserPoll
);

router.post(
  "/",
  [
    validateJWT,
    validateVoteIds,
    check("user", "User's id is required").not().isEmpty(),
    check("poll", "Poll's id is required").not().isEmpty(),
    check("vote", "Elected vote is required").not().isEmpty(),
    validateFields,
  ],
  createVote
);

module.exports = router;
