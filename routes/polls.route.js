const { Router } = require("express");
const { check } = require("express-validator");

const { validateFields } = require("../middlewares/validate-fields");
const { validateJWT } = require("../middlewares/validate-jwt");
const {validatePollId} = require("../middlewares/validate-exist-id");

const {
  createPoll,
  getPolls,
  updatePoll,
  deletePoll
} = require("../controllers/poll.controller");

const router = Router();

router.get("/", validateJWT, getPolls);


router.post(
  "/",
  [
    validateJWT,
    check("question", "Question is required").not().isEmpty(),
    check("answers", "Answers is required").not().isEmpty(),    
    validateFields,
  ],
  createPoll
);

router.put('/:id', [validateJWT, validatePollId], updatePoll);

router.delete('/:id',[validateJWT, validatePollId], deletePoll);


module.exports = router;
