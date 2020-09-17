const { Router } = require("express");
const { check } = require("express-validator");
const expressFileUpload = require('express-fileupload');

const { validateFields } = require("../middlewares/validate-fields");
const { validateJWT } = require("../middlewares/validate-jwt");
const { validateUserId } = require("../middlewares/validate-exist-id");
const { validateImg } = require("../middlewares/validate-img");
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  uploadImgUser,
  imageReceive
} = require("../controllers/user.controller");

const router = Router();

router.get("/", validateJWT, getUsers);
router.get('/img/:name',imageReceive);

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("password", "Password is required").not().isEmpty(),
    check("password", "Password must be longer than 5 characters").isLength({
      min: 6,
    }),
    check("email", "Email is required").not().isEmpty(),
    check("email", "Malformed email").isEmail(),
    validateFields,
  ],
  createUser
);

router.put(
  "/:id",
  [
    validateJWT,
    validateUserId,
    check("name", "Name is required").not().isEmpty(),    
    check("email", "Email is required").not().isEmpty(),
    check("email", "Malformed email").isEmail(),
    validateFields,
  ],
  updateUser
);

router.use(expressFileUpload());//To use file upload on path
router.put('/upload/:id', [validateJWT, validateUserId, validateImg], uploadImgUser);

router.delete('/:id',[validateJWT, validateUserId], deleteUser);

module.exports = router;
