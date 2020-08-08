const express = require("express")
const Task = require("../models/task");
const auth = require("../middleware/auth")


const router = new express.Router()


// THIS IS THE ? QUERY URL BIT. THIS IS WHERE YOU SET THE PARAMS AND WHAT TO DO ETC
// 2 options, limit and skip
// this is called pagination for some reason
// skip is weird. 0 is first page, 10 second 20 third. goes up in 10s depending on whst your limit is
// /tasks?limit=15&skip=30
// /tasks?sortBy=createdAt_asc
// so its like if limit is 10 and skip is 2, starts at 20
router.get("/tasks", auth, async (req, res) => {

    // just like in the weather app. acces like its json
    const match = {}
    const sort = {}
    if(req.query.completed) {
        // will be a string by default so you need to cnovert it
        // since its a string, if its matches the string true then match.completed eill be true
        // if below theres no match, set it to false
        match.completed = req.query.completed === "true"
    }
// looks at if sortBy was provided
        if(req.query.sortBy) {
            // need the special character so you can split it
// grabbing the first item in the parts array, the name of the property youre trying yo chngr
            const parts = req.query.sortBy.split("_")
            // this is basically an if statement, if desc is true value is minus one, else whatever after the colon aka 1
            // if sort parts[0] is set then if the value is desc, then the code to run if or if not
            // sort is an array, looks at second value in parts (asc or desc), if = desc, value = -1
            sort[parts[0]] = parts[1] === "desc" ? -1 : 1
        }

    try {

        // const tasks = await Task.find({owner: req.user._id})
        // this makes a tasks field and fills it with the data from req.user
        // this is where you can make the ? parameters
        await req.user.populate({
            path: "tasks",
            // need to use match to make the paraneters
            match: match,
            options: {
                // parseint takes strings and turns them into numbers
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort: sort
                    // ascending is one descending minus one. this is how to sort through tasks. based on the timestamp
                
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
    // const task = new Task(req.body)
    // so we add on the owner property of whoevers logged in whenever you make a new task
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

router.get("/tasks/:id", auth, async (req, res) => {

    const _id = req.params.id;

    try {
        // const task = await Task.findById(_id)

        // find a task by its id and find out whose it is. _id is the task, owner is the id of the owner
        const task = await Task.findOne({
            _id: _id, owner: req.user._id
        })
        // if it dosent work then just 404. if the id snfd  owner dont match
        if(!task){
            return res.status(404).send()
        }
            res.status(201).send(task)

    } catch (error) {
        res.status(500).send(error)
        
    }
})

router.patch("/tasks/:id", auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["description", "completed"]
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if(!isValidOperation){
        return res.status(400).send({"error": "invalid update"})
    }

    try {
// find a task by its id and ower
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
        // const task = await Task.findById(req.params.id)
// we wanna update task before we know it eists
        if(!task) {
            return res.status(404).send()
        }
        updates.forEach((update) => {
            task[update] = req.body[update]
        })
        // remember to use right models
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