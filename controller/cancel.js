const route = require('express').Router()
const apptModel = require('../model/appt')
const nodemailer=require("nodemailer")  
const handlebars = require("handlebars")
const fs = require("fs")
const path = require("path")
const emailTemplateSource = fs.readFileSync(path.join(__dirname, "/tempCancel.hbs"), "utf8") 

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
 * /cancelApt:
 *   post:
 *     summary: Cancel appointment
 *     description: Cancel a patient's appointment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientName:
 *                 type: string
 *               providerName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Appointment canceled successfully
 *       400:
 *         description: Error canceling appointment
 *       500:
 *         description: Internal server error
 */
route.post('/cancelApt',(req,res)=>{
    console.log(req.body)
    apptModel.deleteOne({patientName:req.body.patientName,providerName:req.body.providerName})
    .then((result)=>{
        console.log("Deleted")
        res.sendStatus(200)
    })
    .catch(err=>{
        console.log(err)
        res.sendStatus(400)
    })
})

/**
 * @swagger
 * /sendCancel:
 *   post:
 *     summary: Send appointment cancellation email
 *     description: Send cancellation email for an appointment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientName:
 *                 type: string
 *               emailId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email sent successfully
 *       400:
 *         description: Error sending email
 *       500:
 *         description: Internal server error
 */
route.post('/sendCancel',(req,res)=>{
    console.log(req.body)
    const htmlToSend = template({name:req.body.patientName}) 
    const mailOptions = {
    from:'balajisampath777@gmail.com', 
    to:req.body.emailId,  
    subject: 'Your appointment is canceled',
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