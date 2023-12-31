const express = require("express");
const router = express.Router();

const eventsController = require('../controller/eventsController');
const Authenticate = require('../middleware/authentication');

router.get('/', Authenticate, eventsController.getEvents);
router.post('/AddEvent', Authenticate, eventsController.addEvent);
router.delete('/', Authenticate, eventsController.deleteAll);
router.get('/:id', Authenticate, eventsController.getEventDetails);
router.put('/basicDetail/:id', Authenticate, eventsController.updatBasicEventDetails);
router.put('/totalBudget/:id', Authenticate, eventsController.updateTotalBudget);
router.delete('/:id', Authenticate, eventsController.deleteEvent);

module.exports = router;
