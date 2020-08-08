const express = require("express")
const jwt = require("jsonwebtoken")
const sharp = require("sharp")
const User = require("../models/user");
const auth = require("../middleware/auth")
const multer = require("multer");
const {sendWelcome, sendCancel} = require("../emails/account")
// auth can be used in only specific routes. will see below


const router = new express.Router()
// all imported from index
// middle arguement, kinda the third, is any middleware you wanna run with it. after it runs if successful it will run the async here
// really easy to add middleware
// can send back headers with the data   
// to provide auth token you have to do this manually in postman with Bearer (jwt token). this is where the client provides the token
// router.get("/users", auth, async (req, res) => {
//     try {
//         const users = await User.find({})
//         res.send(users)
//     } catch (error) {
//         res.status(404).send()
//     }
    
// })

// to add pword hashing, you dont change this but rather the schema
router.post("/users", async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        // makes new token, even if the same every time someone makes a post request to users
        sendWelcome(user.email, user.name)
        
        const token = await user.generateAuthToken()
        
        res.status(201).send({user, token})
    } catch (error) {
        res.status(400).send(error)
    }
})

// static is on the model, methods is just instances
// bind your new method to the methods bit. this is an instance method, for each name for example

// LOGIN FUNCTION
router.post("/users/login", async (req, res) => {
    // using a function on User weve made. takes email and password. have to make in schema first
    try {
        // have to make in models as it is a method directly on the model
        // // we use non upper case for token, as we are interacting with just one user
        // const token = await user.generateAuthToken()
        const user = await User.findByCredentials(req.body.email, req.body.password)

        // use small user as User is the model itself, user is the data
        // right so this is currently broken
        try {
            const token = await user[0].generateAuthToken()
        //     const token = await user.generateAuthToken(req.body.email, req.body.password)
        } catch (error) {
            console.log(error)
        }

        const validUser = await user[0].toJSON()
// returns error message if no work and the user document if it works
        res.send({validUser}) // remember you send back the data with an object
    } catch (error) {
        res.status(400).send()
    }
})

// LOGOUT FUNCTION 
// need token which was used whentey authenticated, so go into auth and vchange 
router.post("/users/logout", auth, async (req, res) => {
    try {
        // access ind tokens with filter. return true when it is not thetoken, so removes when it is false. actually not sure
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

// CHALLENGE
// this logs out all users on all devices. wipes out all the tokens
router.post("/users/logoutAll", auth, async (req, res) => {
    try {
        // access ind tokens with filter. return true when it is not thetoken, so removes when it is false. actually not sure
        req.user.tokens = []
        req.user.password = ""

        await req.user.save()

        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

// // CHALLENGE, user pp
const upload = multer({
    // dest is just where they are stored
    // auto creates directory
    limits: {
        // this is in bytes, so its 1mb
        fileSize: 1000000
    },
    // the value is a function to run whenever a file is uploaded
    // request made, info on file being uploaded, callback to tell multer when we done
    // i guess file filter is a multer method
    fileFilter(req, file, cb){
// this runs when not a pdf
// the \. looks for the dot cos its a special thing in regex, dollar sign just means look at the end
        if(!file.originalname.match(/\.(jpg| jpeg| png)$/)){
            return cb(new Error("please upload images"))
        }

        cb(undefined, true)
        // cb(new Error("file must be pdf"))
        // // undefined cos no error, true if the upload is to be expected. false to reject
        // cb(undefined, true)
    }
})

// whenever you deploy, you lose the file system data stored such as images
// need a seperate route as it deals with image data not json, wanna make sure theyre authenticated before uploading
router.post("/users/me/avatar", auth, upload.single("avatar"), async (req, res) => {
    // take out the dest bit, so it dosent save it to a folder. instead you can access it here
    // remember, just use the model like its json
    // this uses sharp to re size images, also turns it to png
    // this is a buffer of the modified pic
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    // this allows all images to be same size, can be found in the browser
    
    req.user.avatar = buffer

    await req.user.save()

    res.send()
// ERROR HANDLING
}, (error, req, res, next) => {
    // so you can use 2 middlewares here. one for processing one for error. only define in the params the processing one
    // so it dosent return the html error page
    res.status(400).send({error: error.message})
})
// CHALLENGE 
router.delete("/users/me/avatar", auth, async (req, res) => {
    try {
        // clear the avatar field. undefined in mongo just deletes it
        req.user.avatar = undefined
        await req.user.save()
        res.send(req.user)
    } catch (error) {
        res.status(500).send(error)
    }
})
// get user avatar by id
router.get("/users/:id/avatar", async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
// get the user back and if they have an imae. wont run the rest of expression
        if(!user || !user.avatar) {
            throw new Error()
        }

        // this is for header info like data types etc. by default express sends back jsoni
        res.set("Content-type", "image/png")
        // send back image. with this you can query localhost and get image
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

// router.post("/upload", upload.single, (req, res) => {
//     res.send()
//     // need to supply all 4 so express knows its to handle errors. basically error handling on indvidual routes
// }, (error, req, res, next) => {
//     // so you can use 2 middlewares here. one for processing one for error. only define in the params the processing one
//     res.status(400).send({error: error.message})
// })
// k so just using the me dosent work in postman. throws a 404 but dosent actually return anything. gotta use another slash for some reason
// switch up the bearer token in the auth bit in postman. have to chane manually every time you login so we use js to automatwe IN POSTMAN 
//  edit the app call, set authroization to bearer and value to {{tokenName}}
// pm here is just postman
// then: if(pm.response.code === 200) {
    // the value in this key value is the entire response, its return value is the entire document in json
//  pm.environment.set("authToken", pm.response.json()
//    .user[0].tokens.slice(-1)[0].token);
// }
// do it in create users too but the code is 201
router.get("/users/profile/me", auth, async (req, res) => {
    try {
        req.user.password = ""
        req.user.tokens = []
        // console.log(req.user)
        res.send(req.user)
    } catch (error) {
        console.log(error)
    }
})

// the auth thing is all so you can only change your own profile
router.patch("/users/me", auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["name", "email", "password", "age"]
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    
    if(!isValidOperation){
        return res.status(400).send({"error": "invalid update"})
    }
    
    try {
        // use this to make it work with schema. cos again schema dosent directly go t=hrough mongoose
        // const user = await User.findById(req.params.id)

        // only runs if all keys are valid. iterates over each string in the array
        updates.forEach((update) => {
            // this is dynamic so cant use dot
            req.user[update] = req.body[update]
        })
        
        await req.user.save()
        // access the properties like json. this wont always work sinc epeople update different roperties
        // user.name = "someting else"

        // this is to make it workwith middleware. cos it queries the db directly not through mongoose. the schema thing ini models/user
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        
        res.send(req.user)
    } catch (error) {
        res.status(400).send(error)
    }
})


// allows you to only be able to delete your profile
router.delete("/users/me", auth, async (req, res) => {
    try {
        // we get access to this due to the auth middleware
        // const user = await User.findByIdAndDelete(req.user._id)
        // if(!user) {
        //     return res.status(404).send()
        // }
        // this achieves the same results as above
        sendCancel(req.user.email, req.user.name)
        await req.user.remove()
        res.send(req.user)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router


// OLD CODE
    // router.get("/users/:id", async (req, res) => {
    //     const _id = req.params.id;
    
    //     try {
    //         const user = await User.findById(_id)
    //         res.send(user)
    //     } catch (error) {
    //         res.status(404).send()
    //     }
    // })