const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Task = require("./task")

mongoose.connect(process.env.CONN_URL, {
    useNewUrlParser: true,
    useCreateIndex: true
})
// middleware lets us customize our models. can use more advanced features
// this is just to set up the table. shows properties and necessary validation
// mongoose converts it into a schema by default
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        // removes spaces
        trim: true
    }, email: {
        // this guaruntees uniqueness for the db. only catch is we have to wipe the db
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            // uses the validator module then the isEmail method, checking the email value stored in value
            // value is always the field (column) itself
            // like keypair array, but the pair or value goes through validation before adding
            if(!validator.isEmail(value)){
                throw new Error("things are not valid")
            }
        }
    },
    age: {
        type: Number,
        // sets default value. if no age its 0, if age then validate
        default: 0,
        // setting up custom validation, not many methods for mongoose
        validate(value){
            if(value < 0){
                // k this is new, guess its a built in js method
                // throw is just like return, kills the function
                throw new Error("age must be positive")
            }
            // when validating important stuff like credit cards, use a library
        }
        
    }, 
    password: {
        type: String,
        required: true,
        trim: true,
        // minLength: 8 works too
        // goes through the first bit of validation then value has already been partially validated 
        validate(value){
            if(value.length < 8){
                // if password too short or equals password, throw error
                throw new Error("password too short")
                // can use value.includes() can pass in multiple invalid passwords
            } else if (value === "password"){
                throw new Error("pick a better password")
            }
        }
    },
    // required to add new item onto tokens array. stores the token of every login request made
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
// store the data as binary 
    avatar: {
        type: Buffer
    }
    // timestamps: true

})

// setting up virtual property. basically relationships between tables
// first is relationship name, second is options and tables to mod
// not stored in the db, just for mongoose to figure out who owns what
// foreign field is the name of the field on the other thing, the task, which will create the relationship
// so its like using primary keys to look up collections. the value is _id and the relationship name is owner
userSchema.virtual("tasks", {
    ref: "Task",
    localField: "_id",
    foreignField: "owner"
})
// this is so people dont have access to hashed pwords etc
userSchema.methods.toJSON = async function () {
    const user = this
    // this is just the user data, mongoose function only
    const userObject = user.toObject()
// dont remember this one. looks like its a mongoose or mongo function which dosent need brackets
// modifies whats sent back in respnse
    
    return userObject
}
// static is on the model, methods is just instances
// bind your new method to the methods bit. this is an instance method, for each name for example

userSchema.methods.generateAuthToken = async function () {
    // the this in this case is the request being passed through the function
    const user = this
    
    // still in object form after being accessed. always convert to string
    // sign is for generating token
    const token = jwt.sign({_id: user._id.toString()}, process.env.SECRET)
    
    // add token to array and save user. means user can log in on multiple things
    // for every request made, add a token onto the token array defined in the schema
    user.tokens = user.tokens.concat({ token: token})
    
    await user.save()
    
    return token
}
// this is how you add your own functions tp be used in the router bit
// we use static on this as its referring to the whole collection. can use directly on the user model

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.find({email: email})
    // if no user throw an error. kills the function here
    
    if(!user) {
        console.log("nijfjvbei")
        throw new Error("unable to login")
    }
    
// hashes the passwords and compares the hashes. if no hash match, return false
    const isMatch = await bcrypt.compare(password, user[0].password)

    if(!isMatch){
        throw new Error("unable to login")
    }

    return user;
}
// to set up middleware, you use .pre to run smething before an event like saving. and .post to do somethig after like redirecting user
// the pre and post methods work like onevent in normal js. the first param is just the name of the action to perform
// use a normal function because you need to use .this. cant use it onn arrow functions

userSchema.pre("save", async function(next) {
    // this here is the document being saved. because its a pre
    // can use this like json to access different properties
    const user = this
// true if user has been created and true if the key is password. isModified goes over the keys automatically

    if(user.isModified("password")){
        user.password = await bcrypt.hash(user.password, 8)
    }
// the purpose is to run code before user is saved 
// to run code after, always call next(), otherwise it'll be stuck in a loop in the functon. next() also saves it
// have to do this because its an async function
    next()

})

// DELETE USER TASK WHEN USER IS REOMVED. runs just before the remove actually happens
userSchema.pre("remove", async function (next) {
    const user = this
// delete wherever the owner has the user id. you get it from this cos the user runs the function through auth, taking your info to be used here with it
    await Task.deleteMany({owner: user._id})
    next()
})

// when you pass thisin it turns into a schema. pretty much like laravel and mysql
const User = mongoose.model("User", userSchema)
    // user is a contructor function (it defines parameters for the model)
    // obviously will throw error if wrong type or whatever other validation used
    
    module.exports = User;
