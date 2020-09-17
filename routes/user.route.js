const { Router } = require("express");
const { check } = require("express-validator");

const { validateFields } = require("../middlewares/validate-fields");
const { validateJWT } = require("../middlewares/validate-jwt");
const { getUsers, createUser } = require("../controllers/user.controller");

const router = Router();

router.get("/", validateJWT, getUsers);

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("password", "Password is required").not().isEmpty(),
    check(
      "password",
      "The password must be have more than 5 characters"
    ).isLength({ min: 6 }),
    check("email", "Email is required").not().isEmpty(),
    check("email", "Email with incorrect format").isEmail(),
    validateFields,
  ],
  createUser
);

module.exports = router;
