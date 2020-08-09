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
// middle arguement, kind of the third, is any middleware you wanna run with it. after it runs if successful it will run the async here
// really easy to add middleware

// to add pword hashing, you dont change this but rather the schema
// NEW USER
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

// LOGIN FUNCTION
router.post("/users/login", async (req, res) => {
    
    try {
        // have to make in models as it is a method directly on the model
        
        const user = await User.findByCredentials(req.body.email, req.body.password)

        
        try {
            const token = await user[0].generateAuthToken()
        
        } catch (error) {
            console.log(error)
        }

        const validUser = await user[0].toJSON()
// returns error message if no work and the user document if it works
        res.send({validUser})
    } catch (error) {
        res.status(400).send()
    }
})

// LOGOUT FUNCTION 
router.post("/users/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

// LOGOUT ALL
// this logs out all users on all devices. wipes out all the tokens
router.post("/users/logoutAll", auth, async (req, res) => {
    try {
        req.user.tokens = []
        req.user.password = ""

        await req.user.save()

        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

// USER PP
const upload = multer({    
    limits: {
        fileSize: 1000000
    },
    // the value is a function to run whenever a file is uploaded
    
    fileFilter(req, file, cb){

        if(!file.originalname.match(/\.(jpg| jpeg| png)$/)){
            return cb(new Error("please upload images"))
        }

        cb(undefined, true)
        
    }
})

// UPLOAD PP
router.post("/users/me/avatar", auth, upload.single("avatar"), async (req, res) => {
    
    const buffer = await sharp(req.file.buffer)
        .resize({width: 250, height: 250})
        .png()
        .toBuffer()    
    req.user.avatar = buffer

    await req.user.save()

    res.send()
// ERROR HANDLING
}, (error, req, res, next) => {
    
    res.status(400).send({error: error.message})
})

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
// get the user back and if they have an image. wont run the rest of expression
        if(!user || !user.avatar) {
            throw new Error()
        }
        res.set("Content-type", "image/png")
        // send back image. with this you can query localhost and get the image
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})
// GET CURRENT USER PROFILE
router.get("/users/profile/me", auth, async (req, res) => {
    try {
        req.user.password = ""
        req.user.tokens = []
        
        res.send(req.user)
    } catch (error) {
        console.log(error)
    }
})
// UPDATE USER
// auth here so you can only change your own profile
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
        
        // only runs if all keys are valid. iterates over each string in the array
        updates.forEach((update) => {
            // this is dynamic so cant use dot
            req.user[update] = req.body[update]
        })
        
        await req.user.save()
        
        
        res.send(req.user)
    } catch (error) {
        res.status(400).send(error)
    }
})

// DELETE PROFILE
// allows you to only be able to delete your profile
router.delete("/users/me", auth, async (req, res) => {
    try {
        // send cancellation email
        sendCancel(req.user.email, req.user.name)
        await req.user.remove()
        res.send(req.user)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router
