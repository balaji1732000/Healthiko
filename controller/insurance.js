const route = require('express').Router()
const user = require('../model/policy')
const claim = require('../model/claims')
const insure = require('../model/insurance')
const nodemailer=require("nodemailer")  
const handlebars = require("handlebars")
const fs = require("fs")
const path = require("path")
const emailTemplateSource1 = fs.readFileSync(path.join(__dirname, "/tempNewPolicy.hbs"), "utf8") 
const emailTemplateSource2 = fs.readFileSync(path.join(__dirname, "/tempClaim.hbs"), "utf8") 

let transporter = {
    service: 'gmail',
    auth: {
    user: 'anyahealthcarebot@gmail.com' ,
    pass: 'deaq bxzg yfev pgdd',
    }
};


const smtpTransport = nodemailer.createTransport(transporter)
const template1 = handlebars.compile(emailTemplateSource1)
const template2 = handlebars.compile(emailTemplateSource2)

/**
 * @swagger
 * /sendNewPolicyMail:
 *   post:
 *     summary: Send new policy email
 *     description: Send an email notification for a new policy
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
 */
route.post('/sendNewPolicyMail',(req,res)=>{
    console.log(req.body)
    user.create(req.body)
    const htmlToSend = template1({name:req.body.patientName}) 
    const mailOptions = {
    from:'anyahealthcarebot@gmail.com', 
    to:req.body.emailId,  
    subject: 'New Policy Status',
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


/**
 * @swagger
 * /sendClaimMail:
 *   post:
 *     summary: Send claim email
 *     description: Send an email notification for a claim
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientName:
 *                 type: string
 *               policyNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email sent successfully
 *       400:
 *         description: Error sending email
 */
route.post('/sendClaimMail',(req,res)=>{
    console.log(req.body)
    claim.create(req.body)
    insure.findOne({policyNo:req.body.policyNumber})
    .then((result)=>{
      const htmlToSend = template2({name:req.body.patientName}) 
        const mailOptions = {
            from:'anyahealthcarebot@gmail.com', 
            to:result.emailId,  
            subject: 'Claim Status',
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
    .catch(err=>{
        console.log(err)
     })
})


module.exports=route