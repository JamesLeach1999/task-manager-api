// CRUD OPERATIONS

const mongodb = require("mongodb");
// this gives access to function necessary to connect to db
const MongoClient  = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;
// mngoose allows you to validate data, say if required, if made by user if so which one etc
// it is ODM, object document mapper. turns objects into documents for mongo db database

// for some reason just saying "localhost" can break it. just use the ip address for local
const connectionUrl = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";
// this generates new id for us
const id = new ObjectID();
console.log(id.getTimestamp())

// ASYNC OPERATION. JUST USE THE METHOD CONNECT AND PASS IN OPTIONS, THEN A CALLBACK WHEN ITS CONNECTED
// stick pretty much all functionality in this ones callback
// this represents an open connection. have to use ctrl c in cmd line to stop
MongoClient.connect(connectionUrl, { useNewUrlParser: true}, (error, client) => {
    // if an error returns, stop function execution
    if(error) {
        return console.log("unable to connect to db");
    }
    const db = client.db(databaseName);
// 2 args, object of search criteria, callback function
// search criteria can be id, name, anything. to use object id, do in search {id : new ObjectID("id you wanna find")}
// findOne only fetches first match in db
// use find to get all results. returns a cursor, the data you point to
// in find it dosent have a callback, use to array on the find itself as the callback. toArray is a method not a callback function
    // db.collection("tasks").find({description: "cooking"}).toArray((error, user) => {
    //     // if your search criteria has no results return null. not an error
    //     if(error){
    //         return console.log("there was an error, cant find user")
    //     }

    //     console.log(user);
    // })

    // db.collection("users").find({age: 21}).toArray((error, user) => {
    //     // if your search criteria has no results return null. not an error
    //     if(error){
    //         return console.log("there was an error, cant find user")
    //     }

    //     console.log(user);
    // })


    // for updateMany, it takes a promise not a callback
// first arguement is the search criteria, in this case id
// many different update operators like $set not in the docs. all beginning with $
//     db.collection("users").updateOne({
//         _id: new ObjectID("5f0a28dc62aa0308a87a4a1b")
//     }, {
//         // this is where the actual udates are applied. set is one methood of many as you caan do alot with the update one methods
//         // only impacts the fields set out
//         // $set: {
//         //     name: "mickey"
//         // }
//         // only used on int. can incremenet positively or negatively
//         // with this we dont need to pull up the doc, find out the age, increment it then use another operation to update the doc
//         $inc: {
//             age: 1
//         }

//         // can add it right onto the end of the functoin
//     }).then((result) => {
// // if search criteria correct and id found, call the set function and use then on the function
// // if search criteria incorrect or no result found, use the error in the then function
//         console.log(result)
//     }).catch((error) => {
//         console.log(error)
//     })

// ----------------------------------------------------------------------------------------------------
// CHALLENGE UPDATE TASKS

// almost every function here uses a callback as a parameter, so watch out for that remember double brackets
        // db.collection("tasks").updateMany({
        //     completed: false
        // }, {
        //     $set: {
        //         completed: true
        //     }
        // }).then((result) => {
        //     console.log(result)
        // }).catch((error) => {
        //     console.log(error)
        // })


        // DELETE
// as with all the others, you can use multiple search criteria
// this one is probably the easiest
        // db.collection("users").deleteMany({
        //     age: 21
        // }).then((result) => {
        //     console.log(result)
        // }).catch((error) => {
        //     console.log(error)
        // })

        db.collection("tasks").deleteOne({
            description: "yes"
        }).then((result) => {
            console.log(result)
        }).catch((error) => {
            console.log(error)
        })














    // CHALLENGE

    // db.collection("tasks").insertOne(
    //     {
    //         id: id,
    //         description: "yes",
    //         completed: false
    //     }
    // , (error, result) => {
    //     if(error) {
    //         return console.log("errror, cant insert tasks")
    //     }

    //     console.log(result.ops)
    // })
    
    // console.log("connected correctly");

// it refers to collection (table) users, then insert puts on object into it. async here too
// insertOne 1st arguement is document to insert, second is optional options object, then the callback
//     db.collection("users").insertOne({
//         name: "jim",
        // db.collection("users").insertMany([
        //     {
        //         name: "james",
        //         age: 22
        //     }, {
        //         name: "robby",
        //         age: 23
        //     }
        //     // this looks weird but it takes many objects as the first arguement, at the end of the array do a callback function
        // ], (error, result) => {
        //     if(error) {
        //         return console.log("something went wrong")
        //     }

        //     console.log(result.ops)
        // }

        // )
//         age: 21
//     }, (error, result ) => {
//         if(error) {
//             return console.log("unable to insert user");
//         }
//         // ops just shows what youve uploaded. aka the documents aka the rows
//         console.log(result.ops)
//     }
// )

})
// always check your brackets
// have to pass in array for insertMany. makes sense cos you're putting in many documents (rows)