// Sendgrid module
const sgMail = require("@sendgrid/mail");
// Using the environment variable method
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


// Send the email
// sgMail.send({
//     to: "ajdlc47@gmail.com",
//     from: "ajdlc47@gmail.com",
//     subject: "This is my frist creation!",
//     text: "I hope this gets to you."
// });

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "aj@ajscreation.com",
        subject: "Thanks for joining in!",
        text: `Welcome to the app, ${name}. Let me know how you get along with the app!`
    })
}

// Cancellation Email
const cancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "aj@ajscreation.com",
        subject: "Cancelling Your Account",
        text: `Hello ${name}, we see you have cancelled your account, is there anything would could have done differently to keep you?`
    });
}

module.exports = {
    sendWelcomeEmail,
    cancellationEmail
}