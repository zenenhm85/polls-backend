const { Router } = require("express");
const { check } = require("express-validator");

const { validateFields } = require("../middlewares/validate-fields");
const { validateJWT } = require("../middlewares/validate-jwt");
const { loginUser, tokenRenew } = require("../controllers/auth.controller");

const router = Router();

router.post('/',
    [
        check('password','The password is required"').not().isEmpty(),
        check('password','The password must be have more than 5 characters').isLength({min:6}),        
        check('email', 'Email is required').not().isEmpty(),
        check('email', 'Email with incorrect format').isEmail(),
        validateFields
    ],
    loginUser
);

router.get('/',validateJWT,tokenRenew);

module.exports = router;
