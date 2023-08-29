const route = require('express').Router()
const nodemailer=require("nodemailer")  
const handlebars = require("handlebars")
const fs = require("fs")
const path = require("path")
const emailTemplateSource = fs.readFileSync(path.join(__dirname, "/tempChangePolicy.hbs"), "utf8") 

let transporter = {
    service: 'gmail',
    auth: {
    user: 'anyahealthcarebot@gmail.com' ,
    pass: 'deaq bxzg yfev pgdd',
    }
};

const smtpTransport = nodemailer.createTransport(transporter)
const template = handlebars.compile(emailTemplateSource)


/**
 * @swagger
 * /sendChangePolicy:
 *   post:
 *     summary: Send change policy email
 *     description: Send an email notification about policy details change
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               emailId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email sent successfully
 *       400:
 *         description: Error sending email
 */
route.post('/sendChangePolicy',(req,res)=>{
    console.log(req.body)
    const htmlToSend = template({name:req.body.name}) 
    const mailOptions = {
    from:'anyahealthcarebot@gmail.com', 
    to:req.body.emailId,  
    subject: 'About Policy Details',
    html: htmlToSend
        }  
      smtpTransport.sendMail(mailOptions, function (err, info) {
        if (err) {
          console.log('gmail')
          console.log(err);
          res.sendStatus(400)
        } 
        else {
            res.send('mail sent')    
            res.sendStatus(200)   
        }
      });
})


module.exports=route