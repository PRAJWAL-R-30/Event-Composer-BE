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
      eventVenue: req.body.eventVenue,
      isMultiEvent: req.body.isMultiEvent,
      totalBudget: req.body.totalBudget,
      userId: new ObjectId(req.user._id),
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

exports.getEventDetails = async (req, res, next) => {
  try {
    const eventCollection = await db.collection("events");
    console.log(req.params.id);
    let event = await eventCollection.findOne({
      _id: new ObjectId(req.params.id),
    });
    console.log(event);

    const subEventsCollection = await db.collection("subEvents");
    if (event.isMultiEvent) {
      event.subEvents = await subEventsCollection
        .find({ eventId: new ObjectId(event._id) })
        .toArray();
    }

    res.send(event).status(200);
  } catch (err) {
    console.log("Error on events Controller: GetEventDetails Err = ", err);
    return res.json({ error: err, status: 500 }).status(500);
  }
};

exports.updatBasicEventDetails = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updateFields = req.body;
    const eventCollection = await db.collection("events");

    await eventCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    res.status(202).json({ message: "Updated Successfully" });
  } catch (err) {
    console.log("Error on events Controller: updatBasicEventDetails Err = ", err);
    return res.json({ error: err, status: 500 }).status(500);
  }
};

exports.updateTotalBudget = async (req, res, next) => {
  try {
    const id = req.params.id;
    const newBudget = req.body.totalBudget;
    const eventCollection = await db.collection("events");

    const response = await eventCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { totalBudget: newBudget } }
    );
    console.log("Response --> ", response);

    res.json({ totalBudget: newBudget }).status(200);
  } catch (err) {
    console.log("Error on events Controller: updateTotalBudget Err = ", err);
    return res.json({ error: err, status: 500 }).status(500);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const id = req.params.id;
    const eventCollection = await db.collection("events");

    await eventCollection.deleteOne({ _id: new ObjectId(id) });

    res.status(202).json({ message: "Deleted Successfully" });
  } catch (err) {
    console.log("Error on events Controller: deleteEvent Err = ", err);
    return res.json({ error: err, status: 500 }).status(500);
  }
};

