const { Router } = require("express");
const { check } = require("express-validator");

const { validateFields } = require("../middlewares/validate-fields");
const { validateJWT } = require("../middlewares/validate-jwt");
const {validateUserExistAndActive} = require('../middlewares/validate-user');
const { loginUser, tokenRenew, changePassword} = require("../controllers/auth.controller");

const router = Router();

router.post('/',
    [
        validateUserExistAndActive,
        check('password','The password is required').not().isEmpty(),
        check('password','The password must be have more than 5 characters').isLength({min:6}),        
        check('email', 'Email is required').not().isEmpty(),
        check('email', 'Email with incorrect format').isEmail(),
        validateFields
    ],
    loginUser
);
router.post('/change-password',
    [
        validateJWT,
        check('password','The password is required').not().isEmpty(),
        check('password','The password must be have more than 5 characters').isLength({min:6}), 
        check('password2','The password is required"').not().isEmpty(),
        check('password2','The password must be have more than 5 characters').isLength({min:6}),         
        check('email', 'Email is required').not().isEmpty(),
        check('email', 'Email with incorrect format').isEmail(),
        validateFields
    ],
    changePassword
);

router.get('/',validateJWT,tokenRenew);

module.exports = router;
