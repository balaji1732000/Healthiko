const mongoose=require("mongoose")
const  userSchema= mongoose.Schema({
    providerId: {
        type: String,
        unique: true, // Create a unique index on slotId
        required: false
    },
    providerName:{
        type:String,
        required:false
    },
    providerSpeciality:{
        type:String,
        required:false
    },
    providerZipcode:{
        type:Number,
        required:false
    },
    contactNo:{
        type:Number,
        required:false
    },
    img:{
        type:String,
        required:false
    } 
},{versionKey:false})



const  doctorModel=mongoose.model('doctorDetails',userSchema)

module.exports=doctorModel