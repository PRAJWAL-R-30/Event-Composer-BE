const express = require("express");
const router = express.Router();

const eventsController = require('../controller/eventsController');

router.get('/', eventsController.getAllEvents);
router.post('/AddEvent', eventsController.addEvent);
router.delete('/', eventsController.deleteAll);

module.exports = router;