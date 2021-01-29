const sgMail = require('@sendgrid/mail');

const sgAPIKey = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(sgAPIKey);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'martin@martinkruger.com',
    subject: `New Task Manager App account`,
    text: `Welcome to the Task Manager App, ${name}! Let me know how you get along with the app.`,
    html: `Welcome to the <b>Task Manager App</b>, ${name}! Let me know how you get along with the app.`,
  });
};

const sendCancellationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'martin@martinkruger.com',
    subject: `Task Manager App account deleted`,
    text: `Your account was deleted, ${name}! We're sorry to see you go. Please let us know if there was something to improve.`,
    html: `<b>Your account was deleted</b>, ${name}! We're sorry to see you go. Please let us know if there was something to improve.`,
  });
};

module.exports = { sendWelcomeEmail, sendCancellationEmail };
