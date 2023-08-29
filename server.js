const express = require('express')
const mongoose = require('mongoose')
const doctorModel = require('./model/doctor')
const slotModel = require('./model/slots')
const apptModel = require("./model/appt");
const userModel = require('./model/patient')
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const app = express()
app.use(express.json());
app.use(express.urlencoded({extended:true}));   



mongoose.connect('mongodb+srv://Koreai12345:Koreai12345@cluster0.o1tk1yg.mongodb.net/Healthiko?retryWrites=true&w=majority',{useNewUrlParser: true,useUnifiedTopology: true})
.then((res)=>{
    app.listen(4000,()=>{
        console.log('Anya Bot')
    // const doctors = [
    //     { providerId:'1',providerName: 'Sri Ram', providerSpeciality: 'Cardiologist', providerZipcode:110029,contactNo:123456789,  img:"" },
    //     { providerId:'2',providerName: 'Thenmozhi', providerSpeciality: 'Dermatologist', providerZipcode:632002,contactNo:123456789,  img:"" },
    //     { providerId:'3',providerName: 'Hari', providerSpeciality: 'Dentist', providerZipcode:605001,contactNo:123456789,  img:"" },
    //     { providerId:'4',providerName: 'Bhuvansh', providerSpeciality: 'Psycologists', providerZipcode:500045,contactNo:123456789,  img:"" },
    //     { providerId:'5',providerName: 'Shivani Arul', providerSpeciality: 'Cancer Specialist', providerZipcode:500046,contactNo:123456789,  img:"" },
    //     { providerId:'6',providerName: 'Irul', providerSpeciality: 'Eye Specialist', providerZipcode:500047,contactNo:123456789,  img:"" },
    // ]; 

    
    // const insertSlotsForDoctors = async () => {
    //     try {
    //         for (const doctor of doctors) {
    //             const insertedDoctor = await doctorModel.create(doctor);
    
    //             for (let i = 1; i <= 3; i++) {
    //                 const slotsData = {
    //                     providerId: insertedDoctor._id,
    //                     slotId: `Slot${i}`,
    //                     date: '2023-08-24',
    //                     time: '10:00 AM',
    //                     duration: '30 minutes',
    //                     location: 'Location1',
    //                     bookedStatus: false
    //                 };
    //                 await slotModel.create(slotsData);
    //             }
    //         }
    //         console.log('Slots created for all doctors.');
    //     } catch (error) {
    //         console.error('Error creating slots:', error);
    //     }
    // };
    
    // insertSlotsForDoctors();
    

    // const patients = [
    //     {
    //         patientName: 'John Doe',
    //         patientDob: '1990-01-01',
    //         aadharSsn: 1234567890,
    //         contactNo: 9876543210,
    //         emailId: 'john@example.com',
    //         patientZipcode: 12345,
    //         otp: '123456'
    //     },
    //     {
    //         patientName: 'Jane Smith',
    //         patientDob: '1985-05-15',
    //         aadharSsn: 9876543210,
    //         contactNo: 1234567890,
    //         emailId: 'jane@example.com',
    //         patientZipcode: 54321,
    //         otp: '654321'
    //     },
    //     {
    //         patientName: 'Alice Johnson',
    //         patientDob: '1992-07-20',
    //         aadharSsn: 5678901234,
    //         contactNo: 8765432109,
    //         emailId: 'alice@example.com',
    //         patientZipcode: 67890,
    //         otp: '987654'
    //     },
    //     // Add more patient objects here
    //     {
    //         patientName: 'Bob Williams',
    //         patientDob: '1988-03-10',
    //         aadharSsn: 4567890123,
    //         contactNo: 7654321098,
    //         emailId: 'bob@example.com',
    //         patientZipcode: 45678,
    //         otp: '876543'
    //     },
    //     {
    //         patientName: 'Emily Brown',
    //         patientDob: '1995-11-25',
    //         aadharSsn: 2345678901,
    //         contactNo: 6543210987,
    //         emailId: 'emily@example.com',
    //         patientZipcode: 56789,
    //         otp: '765432'
    //     },
    //     {
    //         patientName: 'Michael Wilson',
    //         patientDob: '1982-09-05',
    //         aadharSsn: 7890123456,
    //         contactNo: 5432109876,
    //         emailId: 'michael@example.com',
    //         patientZipcode: 67890,
    //         otp: '654321'
    //     },
    //     // Add more patient objects here
    //     // ...
    // ];
    
    // const insertPatients = async () => {
    //     try {
    //         for (const patient of patients) {
    //             await userModel.create(patient);
    //         }
    //         console.log('Patients created.');
    //     } catch (error) {
    //         console.error('Error creating patients:', error);
    //     }
    // };
    
    // insertPatients();

    
    




    
    // doctorModel.insertMany(doctors)
    //     .then(savedUsers => {
    //         console.log('Users saved:', savedUsers);
    //     })
    //     .catch(error => {
    //         console.error('Error saving users:', error);
    //     });

    const generateAppointments = async () => {
        try {
            // Fetch all patients, doctors, and slots
            const allPatients = await userModel.find({});
            const allDoctors = await doctorModel.find({});
            const allSlots = await slotModel.find({});
    
            const appointments = [];
    
            // Generate appointments by combining patient, doctor, and slot information
            for (const slot of allSlots) {
                const patient = allPatients[Math.floor(Math.random() * allPatients.length)];
                const doctor = allDoctors.find(doc => doc._id.toString() === slot.providerId.toString());
    
                if (patient && doctor) {
                    const appointment = {
                        patientId: patient._id,
                        patientName: patient.patientName,
                        providerName: doctor.providerName,
                        speciality: doctor.providerSpeciality,
                        date: slot.date,
                        time: slot.time
                    };
                    appointments.push(appointment);
                }
            }
    
            // Insert generated appointments into the appointment collection
            await apptModel.insertMany(appointments);
    
            console.log('Appointments created:', appointments);
        } catch (error) {
            console.error('Error generating appointments:', error);
        }
    };
    
    generateAppointments();

})
console.log('Success')})
.catch((err)=>{console.log(err)})


const swaggerOptions = {
    definition: {
        openapi: '3.0.0', // Specify the OpenAPI version
        info: {
            title: 'Appointment Booking API', // Specify the title of your API
            version: '1.0.0', // Specify the version of your API
        },
    },
    // Specify the paths to the API endpoints
    apis: [
        './controller/appointment.js', 
        './controller/login.js', 
        './controller/cancel.js',
        './controller/insurance.js',
        './controller/changePolicy.js',
        './controller/card.js'
     ] // Path to your route files
};



// Serve static files from the 'public' directory
app.use(express.static(__dirname + '/public'));

//route  to login  
const login=require('./controller/login')
app.use(login)


//route to appointment
const appointment=require('./controller/appointment')
app.use(appointment)


//route to reschedule
const reschedule=require('./controller/reschedule')
app.use(reschedule)


//route to cancel
const cancel=require('./controller/cancel')
app.use(cancel)


//route to vicinity
const vicinity=require('./controller/vicinity')
app.use(vicinity)


//route to insurance
const insurance=require('./controller/insurance')
app.use(insurance)


//route to updateProfile
const updateProfile=require('./controller/updateProfile')
app.use(updateProfile)



//route to card
const card=require('./controller/card')
app.use(card)


//route to changePolicy
const changePolicy=require('./controller/changePolicy')
app.use(changePolicy)


//route to viewClaim
const viewClaim=require('./controller/viewClaim')
app.use(viewClaim)

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.get('/', (req, res) => {
    // Adjust the file path to the location of your index.html file
    res.sendFile(__dirname + '/views/index.html');
});





