const route = require('express').Router();
const nodemailer = require('nodemailer');
const handlebars = require("handlebars");
const fs = require("fs")
const path = require("path")
const emailTemplateSource = fs.readFileSync(path.join(__dirname, "/tempSendMail.hbs"), "utf8") 

// Create a nodemailer transporter
const smtpTransport = nodemailer.createTransport({
  service: 'Gmail', // Use your email service
  auth: {
    user: 'sampathbalaji777@gmail.com', // Your email address
    pass: 'iyfy wagx jpjx zwra', // Your email password
  },
});


const template = handlebars.compile(emailTemplateSource)

/**
 * @swagger
 * /sendEmail:
 *   post:
 *     summary: Send an email
 *     description: Send an email with the specified content
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               to:
 *                 type: string
 *                 description: Email recipient
 *               subject:
 *                 type: string
 *                 description: Email subject
 *               text:
 *                 type: string
 *                 description: Email text content
 *     responses:
 *       200:
 *         description: Email sent successfully
 *       500:
 *         description: Internal server error
 */
route.post('/sendEmail', (req, res) => {
  // Get email data from the request body
  const { to, subject, content } = req.body;

  const htmlToSend = template({ to, subject, content });
  // Create email options
  const mailOptions = {
    from: 'sampathbalaji777@gmail.com', // Sender email
    to: to, // Recipient email
    subject: subject, // Email subject
    text: content,
    html:htmlToSend // Email content
  };

  // Send the email
  smtpTransport.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'Email could not be sent' });
    } else {
      console.log('Email sent: ' + info.response);
      res.json({ message: 'Email sent successfully' });
    }
  });
});

module.exports=route
