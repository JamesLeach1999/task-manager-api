const mongoose = require("mongoose")



// very similar to plainold mongo syntax. takes url and options object
// have to define database name in url
mongoose.connect(process.env.CONN_URL, {
    useNewUrlParser: true,
    // create index allows us to index data and quickly access data you need
    useCreateIndex: true
})

// CHALLENGE, NEW MODEL INSIDE TASKS
// for some reason it dosent actually show up as a new collection.
// i guess it finds which collection it is based on what you pass in
// nope, mongoose converts to lower cases and pluralises it. putting an s at the end
// const task = mongoose.model("Task", {
//     description: {
//         type: String,
//         required: true,
//         trim: true
//     }, 
//     completed: {
//         type: Boolean,
//         required: false,
//         default: false
//     }
// })

// const t = new task({
//     description: "hello there"
//     // completed: true
// })

// // THIS BASICALLY TURNS IT INTO A PROMISE OBJECT
// t.save().then((result) => {
//     console.log(result)
// }).catch((error) => {
//     console.log(error)
// })
// first is name for model, second is definition to define the fields we want. makes new collection like tasks or users
// this puts in inside the users database for some reason
// const User = mongoose.model("User", {
//     // this is your data validation
//     name: {
//         type: String,
//         required: true,
//         // removes spaces
//         trim: true
//     }, email: {
//         type: String,
//         required: true,
//         trim: true,
//         lowercase: true,
//         validate(value){
//             // uses the validator module then the isEmail method, checking the email value stored in value
//             // value is always the field (column) itself
//             // like keypair array, but the pair or value goes through validation before adding
//             if(!validator.isEmail(value)){
//                 throw new Error("things are not valid")
//             }
//         }
//     },
//     age: {
//         type: Number,
//         // sets default value. if no age its 0, if age then validate
//         default: 0,
//         // setting up custom validation, not many methods for mongoose
//         validate(value){
//             if(value < 0){
//                 // k this is new, guess its a built in js method
//                 // throw is just like return, kills the function
//                 throw new Error("age must be positive")
//             }
//             // when validating important stuff likecredit cards, use a library
//         }
//         // CHALLENGE, VALIDATE PASSWORD
//     }, 
//     password: {
//         type: String,
//         required: true,
//         trim: true,
//         // minLength: 8 works too
//         // goes through the first bit of validation then value has already been partially validated 
//         validate(value){
//             if(value.length < 8){
//                 // if password too short or equals password, throw error
//                 throw new Error("password too short")
//                 // can use value.includes() can pass in multiple invalid passwords
//             } else if (value === "password"){
//                 throw new Error("pick a better password")
//             }
//         }
//     }

// })
// // user is a contructor function (it defines parameters for the model)
// // obviously will throw error if wrong type or whatever other validation used
// const me = new User({
//     name: "jim   ",
//     email: "james.leach1999@gmail.COM  ",
//     age: 3,
//     password: "passPHRASE"
// })
// // to save to database use methids on your instance. me being the instance of the new model you created
// // you can then use promises on the save method to catch any errors
// me.save().then((result) => {
//     console.log(result)
// }).catch((error) => {
//     console.log(error)
// })
