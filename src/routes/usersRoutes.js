const express = require("express");
const router = express.Router();

const usersController = require('../controller/usersController');

router.post('/register', usersController.addUser);
router.post('/login', usersController.userLogin);

module.exports = router;