const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type : String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ['user','recruiter','admin'],
        default: 'user'
    },
    profilePicture:{
        type:String,
        default:''
    },
    phone:{
        type: String,
    },
    resume:{
        type: String,
        default:''
    },
    bio:{
        type: String,
    },
    skills:[
        {
            type: String
        }
    ],
    experience:{
        type: String,
        default:0
    },
    location:{
        type: String,
    },
    isVerified:{
        type: Boolean,
        default: false
    }
},{
    timestamps: true
});
module.exports = mongoose.model('user', userSchema, 'users');