// HERE WE SET UP AND DEFINE AUTHENTICATION MIDDLEWARE
const jwt = require("jsonwebtoken")
const User = require("../models/user")

const auth = async (req, res, next) => {
    try {
        
        const token = req.header("Authorization").replace("Bearer ", "")
        console.log(token)
        const decoded = jwt.verify(token, process.env.SECRET)
        // looks for a given token value in the tokens array
        // when using the User bit, thats essentially your database query
        const user = await User.findOne({_id: decoded._id, "tokens.token": token})

        if(!user) {
            throw new Error()
        }

// give the route access to the user fetched from the database. so this can be used in the routers file
// this is so you dont keep having to call the db in another file to get the user
        req.user = user
        req.token = token
        next()
    } catch (error) {
        res.status(401).send({"error":"auth din work", e: error})
    }
}

module.exports = auth
