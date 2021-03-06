// this is all the code, using the sendgrid api, used to set the variables and send mail
// much nicer to do it here instead of in routers
const sgMail = require("@sendgrid/mail")


// still need the process.env to access environment variables
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
// surprisingly easy this. can pass in html to make it styled 

// send returns a promise
const sendWelcome = (email, name) => {
    sgMail.send({
        to: email,
        from: "jadlljames@gmail.com",
        subject: "welcome",
        text: `welcome to my app ${name}`
    })
}

const sendCancel = (email, name) => {
    sgMail.send({
        to: email,
        from: "jadlljames@gmail.com",
        subject: "welcome",
        text: `sorry to see you go ${name}`
    })
}
// this is just to export many things
module.exports = {sendWelcome, sendCancel}
