const express = require("express")
const Task = require("../models/task");
const auth = require("../middleware/auth")


const router = new express.Router()

router.get("/tasks", auth, async (req, res) => {

    const match = {}
    const sort = {}
    if(req.query.completed) {
        
        match.completed = req.query.completed === "true"
    }
// looks at if sortBy was provided
        if(req.query.sortBy) {
            // need the special character so you can split it
            const parts = req.query.sortBy.split("_")
            // this is basically an if statement, if desc is true value is minus one, else whatever after the colon aka 1
            sort[parts[0]] = parts[1] === "desc" ? -1 : 1
        }

    try {

        // this is where you can make the query string parameters
        await req.user.populate({
            path: "tasks",
            // need to use match to make the parameters
            match: match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort: sort                
            }
        }).execPopulate()
        
        res.status(200).send(req.user.tasks)

    } catch (error) {
        res.status(404).send()
    }
})

// CREATE TASKS
router.post("/tasks", auth, async (req, res) => {
    // now auth is here, you can associate tasks with people. basically a global for whos logged in
    const task = new Task({
        // everything from req.body but with an owner tag. the dots copy all properties over to the task object
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()

        res.status(201).send(task)
    } catch (error) {
        res.status(400).send()
    }
    
})
//GET TASK BY ID IF AUTHENTICATED
router.get("/tasks/:id", auth, async (req, res) => {

    const _id = req.params.id;

    try {
        // find a task by its id and find out whose it is. _id is the task, owner is the id of the owner
        const task = await Task.findOne({
            _id: _id, owner: req.user._id
        })
        if(!task){
            return res.status(404).send()
        }
            res.status(201).send(task)

    } catch (error) {
        res.status(500).send(error)
        
    }
})
// UPDATE TASK
router.patch("/tasks/:id", auth, async (req, res) => {
    // only works if you have the correct token 
    const updates = Object.keys(req.body)
    const allowedUpdates = ["description", "completed"]
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if(!isValidOperation){
        return res.status(400).send({"error": "invalid update"})
    }

    try {
// find a task by its id and owner
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
        if(!task) {
            return res.status(404).send()
        }
        updates.forEach((update) => {
            task[update] = req.body[update]
        })
        await task.save()

        res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})


router.delete("/tasks/:id", auth, async (req, res) => {
    try {
        // req.user was defined in auth
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if(!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router
