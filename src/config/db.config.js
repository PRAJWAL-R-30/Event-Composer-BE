const { MongoClient } = require("mongodb");
require('../../env');

const uri = process.env.MONOGOCONNECTIONURI || "";

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
