const mongoose = require('mongoose');
const jobSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    requirements:[
        {
            type: String
        }
    ],
    salary:{
        min:{
            type: Number,
        },
        max:{
            type: Number,
        },
        currency:{
            type: String,
            default: 'INR'
        }
    },
    location:{
        type: String,
        required: true
    },
    jobType:{
        type: String,
        enum: ['full-time', 'part-time', 'contract', 'internship', 'permanent'],
        default: 'full-time'
    },
    experienceLevel:{
        type: String,
        enum: ['entry-level', 'mid-level', 'senior', 'lead', 'executive'],
        default: 'entry-level'
    },
    skills:[{type: String}],
    company:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    }],
    postedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    applicationDeadline:{
        type: Date,
    },
    isActive:{
        type: Boolean,
        default: true
    },
    applicationCount:{
        type: Number,
        default: 0
    }
}, {timestamps: true});
module.exports = mongoose.model('Job', newSchema, 'jobs');