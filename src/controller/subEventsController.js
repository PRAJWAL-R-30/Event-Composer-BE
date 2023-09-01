const { ObjectId } = require("mongodb");
const db = require("../config/db.config");

exports.getAllSubEvents = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id))
      return res.status(400).send({ message: "Invalid ID" });

    const subEventsCollection = await db.collection("subEvents");
    let results = await subEventsCollection
      .find({ eventId: new ObjectId(id) })
      .toArray();

    res.send(results).status(200);
  } catch (err) {
    console.log("Error on subEvents Controller: updateSubEvent Err = ", err);
    return res.json({ error: err, status: 500 }).status(500);
  }
};

exports.updateSubEvent = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id))
      return res.status(400).send({ message: "Invalid ID" });

    const updatedEvent = {
      subEventName: req.body.subEventName,
      subEventVenue: req.body.subEventVenue,
      subEventDateTime: req.body.subEventDateTime,
      estimatedBudget: req.body.estimatedBudget,
      eventId: new ObjectId(req.body.eventId),
    };
    const subEventsCollection = await db.collection("subEvents");
    const response = await subEventsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedEvent }
    );

    res.status(202).json({ message: "Updated Successfully" });
  } catch (err) {
    console.log("Error on subEvents Controller: updateSubEvent Err = ", err);
    return res.json({ error: err, status: 500 }).status(500);
  }
};
