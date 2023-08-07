const { ObjectId } = require("mongodb");
const db = require("../config/db.config");

exports.getEvents = async (req, res, next) => {
  try {
    const user = req.user;
    let collection = await db.collection("events");
    let results = await collection
      .find({ userId: new ObjectId(user._id) })
      .limit(10)
      .toArray();

    console.log("Results");

    res.send(results).status(200);
  } catch (err) {
    console.log("Error on events Controller: getAllEvents Err = ", err);
    return res.json({ error: err, status: 500 }).status(500);
  }
};

exports.addEvent = async (req, res, next) => {
  try {
    let eventsCollection = await db.collection("events");
    const newEvent = {
      eventName: req.body.eventName,
      eventType: req.body.eventType,
      eventDesc: req.body.eventDesc,
      eventDateTime: req.body.eventDateTime,
      isMultiEvent: req.body.isMultiEvent,
      totalBudget: req.body.totalBudget,
      userId: new ObjectId(req.user._id)
    };

    const eventsResponse = await eventsCollection.insertOne(newEvent);
    const newEventId = eventsResponse.insertedId;

    let subEventsCollection = await db.collection("subEvents");
    const subEvents = req.body.subEvents;

    if (subEvents.length) {
      subEvents.forEach((element) => {
        element.eventId = newEventId;
      });
      const options = { ordered: true };
      const subEventsResponse = await subEventsCollection.insertMany(subEvents);
    }

    res.send({ message: "Inserted Successfully" }).status(204);
  } catch (err) {
    console.log("Error on events Controller: addEvent Err = ", err);
    return res.json({ error: err, status: 500 }).status(500);
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    let collection = await db.collection("events");
    let result = await collection.deleteMany({});
    res.send(result).status(204);
  } catch (err) {
    console.log("Error on events Controller: deleteAll Err = ", err);
    return res.json({ error: err, status: 500 }).status(500);
  }
};
