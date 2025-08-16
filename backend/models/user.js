const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    faceFeatures:{
        type: [Number],
        required:true,
    },
    isInstructor:{
        type:Boolean,
        default:false,
    }
})

const User = mongoose.model('User' , userSchema);

module.exports = {
    User,
}