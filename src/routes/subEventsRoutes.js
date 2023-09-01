const express = require("express");
const router = express.Router();

const Authenticate = require('../middleware/authentication');
const subEventsController = require('../controller/subEventsController')

router.get('/:id', Authenticate, subEventsController.getAllSubEvents);
router.put('/:id', Authenticate, subEventsController.updateSubEvent);

module.exports = router;