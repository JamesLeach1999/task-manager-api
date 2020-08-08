const mongoose = require("mongoose")
const validator = require("validator")
// we define the models in different files and folders to keep organised

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    }, 
    completed: {
        type: Boolean,
        required: false,
        default: false
    },
    owner: {
        // this sets it directly on mongoose schema. every task nees ds an owner
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // this is referencing oter models. like foreign keys. the omdel name is User
        ref: "User"
    }
}, {
    // i have no idea why its out of the object like this. i guess its some sort of methd
    timestamps:true
})
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
//     },
//     owner: {
//         // this sets it directly on mongoose schema. every task nees ds an owner
//         type: mongoose.Schema.Types.ObjectId,
//         required: true,
//         // this is referencing oter models. like foreign keys. the omdel name is User
//         ref: "User"
//     }
//         // timestamps: true
    
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
const Task = mongoose.model("Task", taskSchema)
module.exports = Task;