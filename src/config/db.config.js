const { MongoClient } = require("mongodb");

const uri = process.env.MONGOCONNECTIONURI || "";

const client = new MongoClient(uri);

let db;

try {
  client.connect();
  console.log("Connected to MongoDB Atlas");
  db = client.db("EventComposer");
} catch (error) {
  console.error(error);
}

module.exports = db;
