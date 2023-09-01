const route = require('express').Router()
const user = require('../model/appt')
const doctor = require('../model/doctor')
const slots = require('../model/slots')
const nodemailer=require("nodemailer")  
const handlebars = require("handlebars")
const fs = require("fs")
const path = require("path")
const emailTemplateSource = fs.readFileSync(path.join(__dirname, "/tempApt.hbs"), "utf8") 

let transporter = {
    service: 'gmail',
    auth: {
    user: 'promtgenerator2000@gmail.com' ,
    pass: 'Hema@123',
    }
};

const smtpTransport = nodemailer.createTransport(transporter)
const template = handlebars.compile(emailTemplateSource)


/**
 * @swagger
 * /verifyDoctor:
 *   post:
 *     summary: Verify doctor
 *     description: Verify doctor using contact number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contactNo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Doctor found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Doctor not found
 *       500:
 *         description: Internal server error
 */
route.post('/verifyDoctor', (req, res) => {
    console.log('Request Body:', req.body);
    doctor.findOne({providerSpeciality:req.body.providerSpeciality}).then((result) => {
            console.log('Result:', result);
            if (result === null) {
                console.log('Doctor not found');
                return res.sendStatus(404);
            } else {
                console.log('Doctor found:', result);
                return res.status(200).send(result);
            }
        })
        .catch(err => {
            console.log('Error:', err);
            return res.status(500).send(err); // Send an appropriate response
        });
});



/**
 * @swagger
 * /checkSlots:
 *   post:
 *     summary: Check slots
 *     description: Check available slots
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               providerId:
 *                 type: string
 *               scheduleDate:
 *                 type: string
 *               scheduleTime:
 *                 type: string
 *     responses:
 *       200:
 *         description: Slot found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Slot not found
 *       500:
 *         description: Internal server error
 */
route.post('/checkSlots',(req,res)=>{
    console.log(req.body)
        slots.findOne({providerId:req.body.providerId,date:req.body.scheduleDate})
        .then((result)=>{
            console.log(result)
            if(result === null)
            {
                res.sendStatus(404)
            }
            else{
                if(result.time.slice(0,2) === req.body.scheduleTime.toString().slice(1,3) && result.bookedStatus === false)
                {
                    console.log(result)
                    res.send(result)
                    return res.sendStatus(200)
                } 
                else{
                    return res.sendStatus(404)
                }
            }   
        })
        .catch(err=>{
           console.log(err)
        })
})

/**
 * @swagger
 * /updateSlots:
 *   post:
 *     summary: Update slots
 *     description: Update booked status of a slot
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               providerId:
 *                 type: string
 *               scheduleDate:
 *                 type: string
 *               scheduleTime:
 *                 type: string
 *     responses:
 *       200:
 *         description: Slot updated
 *       404:
 *         description: Slot not found or booked status cannot be updated
 *       500:
 *         description: Internal server error
 */
route.post('/updateSlots',(req,res)=>{
    console.log(req.body)
        slots.findOne({providerId:req.body.providerId,date:req.body.scheduleDate})
        .then((result)=>{
            console.log(result)
            if(result === null)
            {
                res.sendStatus(404)
            }
            else{
                if(result.time.slice(0,2) === req.body.scheduleTime.toString().slice(1,3) && result.bookedStatus === false)
                {
                    result.bookedStatus = true
                    result.save()
                    return res.sendStatus(200)
                }  
              }   
        })
        .catch(err=>{
           console.log(err)
        })
})

/**
 * @swagger
 * /insert:
 *   post:
 *     summary: Insert user
 *     description: Insert user data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Define properties based on your user schema
 *     responses:
 *       200:
 *         description: User created successfully
 *       500:
 *         description: Internal server error
 */

route.post('/insert',(req,res)=>{
    console.log(req.body)
    user.create(req.body)
    res.send('user created')
})


/**
 * @swagger
 * /sendApt:
 *   post:
 *     summary: Send appointment email
 *     description: Send confirmation email for an appointment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Define properties based on your email schema
 *     responses:
 *       200:
 *         description: Email sent successfully
 *       400:
 *         description: Error sending email
 *       500:
 *         description: Internal server error
 */
route.post('/sendApt',(req,res)=>{
    console.log(req.body)
    const htmlToSend = template({name:req.body.patientName,doctor:req.body.providerName,speciality:req.body.speciality,date:req.body.date,time:req.body.time}) 
    const mailOptions = {
    from:'balajisampath777@gmail.com', 
    to:req.body.emailId, 
    subject: 'Your appointment is confirmed',
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
