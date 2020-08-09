// CRUD OPERATIONS

const mongodb = require("mongodb");
// this gives access to function necessary to connect to db
const MongoClient  = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;
// mngoose allows you to validate data, say if required, if made by user if so which one etc
// it is ODM, object document mapper. turns objects into documents for mongo db database

const connectionUrl = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";
// this generates new id for us
const id = new ObjectID();
console.log(id.getTimestamp())

// this represents an open connection. have to use ctrl c in cmd line to stop
MongoClient.connect(connectionUrl, { useNewUrlParser: true}, (error, client) => {
    // if an error returns, stop function execution
    if(error) {
        return console.log("unable to connect to db");
    }
    const db = client.db(databaseName);
})
// always check your brackets
// have to pass in array for insertMany. makes sense cos you're putting in many documents (rows)
