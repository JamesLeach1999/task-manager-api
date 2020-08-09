const express = require("express")
require("./db/mongoose")
const userRouter = require("../src/routers/user")
const taskRouter = require("../src/routers/task")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const app = express()
// need to use a node module to access from all project also cross os
const port = process.env.PORT


app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log("server up on port " + port)
})
