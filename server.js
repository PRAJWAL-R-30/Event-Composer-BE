const express = require("express");
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const eventsRoutes = require('./src/routes/eventsRoutes');
const usersRoutes = require('./src/routes/usersRoutes');
const subEventsRoutes = require('./src/routes/subEventsRoutes');

const port = process.env.PORT || 3001;
  
app.use(express.json());
app.use(cors());

//Routes
app.use("/events/", eventsRoutes);
app.use("/users/", usersRoutes);
app.use("/subEvents/", subEventsRoutes);

// app.get("/getEvents", async(req, res) => {
//   let collection = await db.collection('events');
//   let results = await collection.find({})
//     .limit(10)
//     .toArray();

//     res.send(results).status(200);
// });

// app.post("/AddEvent", async (req, res) => {
//   let collection = await db.collection('events');
//   let newDocument = req.body;
  
//   let result = await collection.insertOne(newDocument);
//   res.send(result).status(204);
// })

//password: HnY7YF6kYljpYl97

app.listen(port, () => {
  console.log("Server listening on port", port);
});
