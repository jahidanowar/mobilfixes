// Import Dependencies
const nodemailer = require("nodemailer");

/*
 *  Makeing a Transporter to sending mail
 */
const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: process.env.NODEMAILER_PORT,
  secure: false,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASSWORD,
  },
  tls: { rejectUnauthorized: true },
});

/*
 *  send mail with defined transport object
 */
const mailToUserForSignup = (name, email) => {
  transporter.sendMail({
    from: '"node app " <mondaldipu904@gmail.com>',
    subject: "Node app",
    text: "Hello world",
    to: email,
    html: `
  <h3>Hey ${name}, Welcome you, with a big Heart from Us.</h3>
  <p>We'll send all the information on your email.</p>
  `,
  });
};

/*
 *  Send a url with reset paswword token to confirm right user
 */
const mailToUserForPasswordReset = (token, email) => {
  transporter.sendMail({
    from: '"node app " <mondaldipu904@gmail.com>',
    subject: "Node app",
    text: "Hello world",
    to: email,
    html: `
       <h3>Password Reset!</h3>
       <p>Make sure, you want to change your password?</p>
        <a href="http://localhost:5000/user/reset/${token}">Click Here</a>
         `,
  });
};
/*
 *  Mail to the booking customer
 */
const mailToUserForBooking = (email) => {
  transporter.sendMail({
    from: '"node app " <mondaldipu904@gmail.com>',
    subject: "Node app",
    text: "Hello world",
    to: email,
    html: `
       <h3>Booking Successfull .</h3>
       <p>We will Serving you as soon as possible.</p>
        `,
  });
};

/*
 *  mail to the shop Admin while someone booked something
 */
const mailToShopAdminForBooking = (email) => {
  transporter.sendMail({
    from: '"node app " <mondaldipu904@gmail.com>',
    subject: "Node app",
    text: "Hello world",
    to: email,
    html: `
       <h3>Someone has book something.</h3>
        `,
  });
};
/*
 *  mail to the Super Admin while someone booked something
 */
const mailToSuperAdminForBooking = () => {
  transporter.sendMail({
    from: '"node app " <mondaldipu904@gmail.com>',
    subject: "Node app",
    text: "Hello world",
    to: "alex@gmail.com",
    html: `
       <h3>Someone has book something.</h3>
        `,
  });
};

module.exports = {
  mailToUserForSignup,
  mailToUserForPasswordReset,
  mailToUserForBooking,
  mailToShopAdminForBooking,
  mailToSuperAdminForBooking
};
