const mongoose = require("mongoose")


// configure mongoose options
mongoose.connect(process.env.CONN_URL, {
    useNewUrlParser: true,
    // create index allows us to index data and quickly access data you need
    useCreateIndex: true
})
