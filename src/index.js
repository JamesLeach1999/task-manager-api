const express = require("express")
// just importing user frm the other file
require("./db/mongoose")
// const User = require("./models/user")
// const Task = require("./models/task")
// const { Router } = require("express")
const userRouter = require("../src/routers/user")
const taskRouter = require("../src/routers/task")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const app = express()
// process.env gives access to env variables
// need to use a node module to access from all project also cross os
const port = process.env.PORT


const errorMiddleware = (req, res, next) => {
    throw new Error("from my middleware")
}
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log("server up on port " + port)
})



// const multer = require("multer")
// const upload = multer({
//         // dest is just where they are stored
//     dest: "images"
// })
// // looks like single is only something you can use on a multer object, only arg is a name for the upload
// // have to sort this all in postman, itlooks for a file called uplaod in the search params. upload.single returns middleware to use
// app.post("/upload", upload.single("upload"), (req, res) => {
//         res.send()
// })

    // these are all express values

// with middleware:         new request -> do something -> run route handler. not just running the route handler
// REGISTERING MIDDLEWARE
// app.use((req, res, next) => {
// // this will eventually be authentication
//     if(req.method === "GET") {
//         // without res.send, it just stays in a loading screen
//         res.send("GET requests disabled")
//     } else {
//         // so do this to get outof the function
//         next()
//     }
// })


// // this shows the GET/ POST and the location of the path
//     // this is just GET /users. we're able to log shit out and also execute query
//     // console.log(req.method, req.path)
//     // like before this needs to be called to get the result
// })

// MAINTENANCE MODE CHALLENGE
// app.use((req, res, next) =>{
//     // REJECT ALL REQUESTS
//     if(req.method){
//         res.status(503).send("all requests disabeled")
//     }
// })
// setting heroku port, process is just whatever service isrunning with methods on it

// STILL WORKS USING ALL THE ROUTES IN SEPERATE FILES
// can only use await on async functions


// app.get allows for people to get a specific route
// app.use customises the server with whatever things are in the docs
// this automatically parses json so it can be added with the post


// router takes care of the behind the scenes connecting. you just have to use the route here
// this imports all of the routes within the routers/user.js
// admittidely this does look way better

// SOMETHING, JUST A DEMONSTRATION

// const Task = require("./models/task")
// const User = require("./models/user")
// // find task by id, manually
// const main = async () => {
//     // const task = await Task.findById("5f21eca8a5aae46860062969")
//     // // populate allows us to get data fro a relationship  between 2 collections. by using the id
//     // // so you access the owner property directly on taks and get the id of owner. from thwat it pulls all the information . execPopulate just fires it off
//     // await task.populate("owner").execPopulate()
//     // // it populates the owner property on tasks, then its printer below
//     // // prints out full task. you can use another qurry to search manually with id but mongoose has helpers
//     // console.log(task.owner)

//     // const user = await User.findById("5f21fae03d7f01591cec5725")
//     // // tasks here is the relationship name like owner is above
//     // await user.populate("tasks").execPopulate() 
//     // console.log(user.tasks)
// }

// main()







// OLD CODE
// ----------------------------------------------------------------------------------------


// // jwt for allowing users to do things when logged in
// const myFunction = async () => {
//     // the return value is the actual token
//     // 1st param is the data to be embedded in the token, second is a secret to sign the token to make sure it hasnt been altered with
//     // the goal is to create data (_id) which is verifiable with the secret. third param is extra options in object. always use string for expiresIn
//     const token = jwt.sign({_id: "abc123"}, "thats numberwang", {expiresIn: "1 day"})
//     // in the token you get the data body from middle value. can be decoded, also assigned a timestamp
//     // console.log(token)
//     // 1st arg is the token to verify, second is secret to use
//     // returns payload (data) if things go well
//     const data = jwt.verify(token, "thats numberwang")
// }

// myFunction()

// SEPERATING ROUTE
// express method, dosent take arguements. then use the same methods as for the app variable
// const router = new express.Router()

// router.get("/test", (req, res) => {
    //     res.send("routerinio")
    // })
    // // uses the router path you provided
    // app.use(router)
    
// USER ENDPOINTS
// app.get("/users", async (req, res) => {


//     try {
//         const users = await User.find({})
//         res.send(users)
//     } catch (error) {
//         res.status(404).send()
//     }
//     // find is a promise
//     // User.find({}).then((users) => {
//     //     res.send(users)
//     // }).catch((e) => {
//     //     res.status(500).send()
//     // })
    
//     // res.send(user)
// })
// // 2 different endpoints. have to send data in postman (json format) but saves to mongo so is basically an api
// // this is for resource creation
// app.post("/users", async (req, res) => {
//     // loads it like in the other file. when you add the json in postman you only want the body, not info about the json itself
//     const user = new User(req.body)
//     // yeah this looks way better tbf

//     try {
//         await user.save()
//         // only runs if promise fulfilled
//         res.status(201).send(user)
//     } catch (error) {
//         // only runs if promise is not
//         res.status(400).send(error)
//     }
// // everything after this will only run if user saved,its a promise
    
//     // user.save().then((result) => {
//     //     // here we respond to the person who made the request, by sending back data
//     //     res.send(user)
//     // }).catch((error)=> {
//     //     // even if error, it will come up with 200 ok. you can change this
//     //     // you have to set status before you send it. can chain them
//     //     res.status(400).send(error)
//     //     // res.send(error)
//     // })
//     // this grabs the data and sends it to terminal
//     // console.log(req.body)
//     // res.send("testing")
// })
// // onlygets users with specific id. no question mark just /users/arguements
// app.get("/users/:id", async (req, res) => {
//     // this now works as an endpoint. have to go into robo to get id then postman after users/ 
//     const _id = req.params.id;
// // different method here for finding one by id
//     try {
//         const user = await User.findById(_id)
//         res.send(user)
//     } catch (error) {
//         res.status(404).send()
//     }
//     // access request params using dot
//     // User.findById(_id).then((user) => {
//     //     if(!user){ 
//     //         // this is if you cant find an id match
//     //         return res.status(404).send()
//     //     }
//     //     // if there is a user, send it back
//     //     res.send(user)
//     // }).catch((e) => {
//     //     res.status(500).send()
//     // })
//     // this shows all the route params, in this case its an object with single value id
//     // console.log(req.params)
// })
// // thi is for updating resource
// app.patch("/users/:id", async (req, res) => {
//     // these are the only values you can update. cant do id and cant make new ones
//     // youre trying to get an array of strings from the object. where each DOCUMENT bit is matched with a key
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ["name", "email", "password", "age"]
//     // this gets called for every itme in the array.i guess like a foreach
//     const isValidOperation = updates.every((update) => {
//         // since its a foreach, every update is seperated into its keys, name age etc
//         // includes is basically in_array() in php. goes over for every allowedUpdate item and returns true if all are allowed
//         return allowedUpdates.includes(update)
//     })
//     // is valid only returns true if all keys are allowed. return to kill the function

//     if(!isValidOperation){
//         return res.status(400).send({"error": "invalid update"})
//     }

//     try {
//         // access the id by using req.params.id, like json but these are methods
//         // req.body takes in the actual data with which you  wanna change the document
//         // 1st param id, second data to change, third options
//         // new returns the user after its changed, otherwise it shows the user before the change, run validation just validates data, always use
//         const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

//         if(!user) {
//             return res.status(404).send()
//         }
//         res.send(user)
//     } catch (error) {
//         res.status(400).send(error)
//     }
// })
// // this is pretty self explanatory
// app.delete("/users/:id", async (req, res) => {
//     // the less complexity youre taking it, the less complex the handler
//     try {
//         const user = await User.findByIdAndDelete(req.params.id)
//         // if no user send this back
//         if(!user) {
//             return res.status(404).send()
//         }
//         res.send(user)
//     } catch (error) {
//         res.status(500).send(error)
//     }
// })



// TASK ENDPOINTS
// app.get("/tasks", async (req, res) => {

//     try {
//         const tasks = await Task.find({})
//         res.status(200).send(tasks)
//     } catch (error) {
//         res.status(404).send()
//     }
//     // empty object just means find all
//     // Task.find({}).then((task) => {
//     //     res.status(201).send(task)
//     // }).catch((e) => {
//     //     res.status(404).send(e)
//     // })
// })
// app.post("/tasks", async (req, res) => {
//     const task = new Task(req.body)

//     try {
//         await task.save()

//         res.status(201).send(task)
//     } catch (error) {
//         res.status(400).send()
//     }
//     // task.save().then((result) => {
//     //     res.status(201).send(task)
//     // }).catch((e) => {
//     //     // this sends back error in html format, can customize status code
//     //     res.status(400).send(e)
//     // })
// })

// app.get("/tasks/:id", async (req, res) => {

//     const _id = req.params.id;

//     try {
//         // all exactly the same as below. just easier to work with since its basically synchronos
//         const task = await Task.findById(_id)
//         if(!task){
//             return res.status(404).send()
//         }
//             res.status(201).send(task)

//     } catch (error) {
//         res.status(500).send(error)
        
//     }
// })

// app.patch("/tasks/:id", async (req, res) => {
// // validate update fields
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ["description", "completed"]

//     const isValidOperation = updates.every((update) => {
//         return allowedUpdates.includes(update)
//     })
//     if(!isValidOperation){
//         return res.status(400).send({"error": "update not allowed"})
//     }
// // find id of thing to update, then set to the validated request body
//     // once the rquest body is validated, by turning it into keys, checking against those keys then returning true. its passed onto this
//     try {
//         // remember, the second param is just what you wanna chnge. can be json or taken from the request
//         const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

//         if(!task) {
//             return res.status(404).send()
//         }
//         res.send(task)
//     } catch (error) {
//         res.status(400).send(error)
//     }
// })


// app.delete("/tasks/:id", async (req, res) => {
//     try {
//         const task = await Task.findByIdAndDelete(req.params.id)
//         if(!task) {
//             return res.status(404).send()
//         }
//         res.send(task)
//     } catch (error) {
//         res.status(500).send(error)
//     }
// })

