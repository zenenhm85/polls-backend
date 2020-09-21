const { Router } = require('express');

const { validateJWT } = require("../middlewares/validate-jwt");
const {getUsers, getPolls} = require('../controllers/search.controller');

const router = Router();


router.get('/users/:search',validateJWT, getUsers);
router.get('/polls/:search',validateJWT, getPolls);


module.exports = router;