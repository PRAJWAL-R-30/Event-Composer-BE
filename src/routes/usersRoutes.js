const express = require("express");
const router = express.Router();

const usersController = require('../controller/usersController');
const Authenticate = require('../middleware/authentication');

router.post('/register', usersController.addUser);
router.post('/login', usersController.userLogin);
router.get('/user', Authenticate, usersController.getUserDetails);

module.exports = router;