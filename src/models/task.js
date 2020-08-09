const mongoose = require("mongoose")
const validator = require("validator")
// we define the models in different files and folders to keep organised
// here we essentially define the equivalent of a table in sql
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
        // this is referencing other models. like foreign keys. the model name is User. like foregin keys in SQL
        ref: "User"
    }
}, {
    timestamps:true
})

const Task = mongoose.model("Task", taskSchema)
module.exports = Task;
