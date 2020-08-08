// HERE WE SET UP AND DEFINE AUTHENTICATION MIDDLEWARE
const jwt = require("jsonwebtoken")
const User = require("../models/user")

const auth = async (req, res, next) => {
    try {
        // have to use the headers bit in postman. you used params thats why it wasnt working
        const token = req.header("Authorization").replace("Bearer ", "")
        console.log(token)
        const decoded = jwt.verify(token, process.env.SECRET)
        // looks for a given token value in the tokens array
        // remember, when using the USer bit, thats essentially your database query
        const user = await User.findOne({_id: decoded._id, "tokens.token": token})

        if(!user) {
            throw new Error()
        }

// give the route access to the user fetched from the database. so this can be used in the routers file
// this is so you dont keep having to call the db in another file to get the user
// YOU USE THESE EVERYWHERE
        req.user = user
        req.token = token
        next()
    } catch (error) {
        res.status(401).send({"error":"auth din work", e: error})
    }
}

module.exports = auth

















// OLD CODE
// ---------------------------------------------------------------------------------------------------------------------------


        //     try {
        //         // how to get header access. req makes everything pretty easy
        //         // tutorial a bit wrong. have to access like this because its an array
        //         const token = req.query['Authorization'].replace("Bearer ", "")
        //         // verify with the same library that created it
        //         const decoded = jwt.verify(token, "thats numberwang")
        //         // find one user with the id we want. goes through all the users till a match
        //         // can access _id from decoded cos remember, the token has all of the contents too. looks for correct id and token stored
        //         const user = await User.findOne({_id: decoded._id, "tokens.token": token}) //looks through the tokens array on all users, then the second token is for just one user
        
        //         if(!user) {
        //             // this is enough to trigger catch below
        //             throw new Error("where is it")
        //         }
        
        //         // stores the user variable from above
        //         // only with a valid token, a verified token and a user with a specific id/token can the user be sent back. else its a fail
        //         // req.user is a value made available in routers. its basically your own access token
        //         req.user = user
        //         console.log(req.user)
        //         // use route handler, but also pass back the user with token
        //         next()
        //     } catch (error) {
        //         // since next isnt called the function never ends and just sends this back
        //         res.status(401).send({error: "please aurth"})
        //     }
        
        
        //     // console.log("auth middleware")
        //     // // next allows the associated route handler (the post, patch get whatever) to run
        //     // next()
        // }