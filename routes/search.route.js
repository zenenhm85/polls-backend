const { Router } = require('express');

const {validateJWT} = require('../middlewares/validate-jwt');
const {getUsers} = require('../controllers/search.controller');

const router = Router();


router.get('/users/:search',validateJWT, getUsers);


module.exports = router;