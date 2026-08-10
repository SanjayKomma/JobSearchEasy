const Job = require('../models/job');
const Application = require('../models/application');
const company = require('../models/company');
const applicationController = {
    applyForJob: async (request, response)=>{
        try{
            const {jobId}  = request.params;
            const userId = request.userId;
            const {coverLetter} = request.body;
            const job =await Job.findOne({_id: jobId, isActive: true});
            if(!job){
                return response.status(404).json({message: "Job not found"});
            }
            const existingApplication = await Application.findOne({ job: jobId, applicant: userId});
            if(existingApplication){
                return response.status(400).json({message: "You have already applied for this job"});
            }
            if(job.applicationDeadline > new Date()){
                return response.status(400).json({message: "Application deadline has not passed"});
            }
            const application = new Application({
                job: jobId,
                applicant: userId,
                coverLetter: coverLetter || ''
            });
            await application.save();
            await Job.findByIdAndUpdate(jobId, {$inc: {applicationCount: 1}});
            return response.status(201).json({message: "Application created successfully", application});
        }
        catch(error){
            return response.status(500).json({message:"Failed to apply for the job", error: error.message});
        }
    },
    getUserApplications: async (request, response)=>{
        try{
            const userId = request.userId;
            const application = await Application.find({applicant: userId}).populate({
                path: 'job',
                select: 'title description location jobType experienceLevel company',
                // populate: company,
                populate:{
                    path: 'company',
                    select: 'name logo'
                }
            })
            .sort({createdAt: -1});
            return response.status(200).json({message: "User applications fetched successfully", application});
        }
        catch(error){
            return response.status(500).json({message:"Failed to get user applications", error: error.message});
        }
    },
    updateApplicationStatus: async (request, response)=>{
        try{
            const {applicationId} = request.params;
            const {notes, status} = request.body;
            const userId = request.userId;
            const application = await Application.findById(applicationId)
                .populate({
                    path: 'job',
                    populate:{
                        path: 'postedBy',
                    }
                })
                .populate('applicant', 'name email');
            if(!application){
                return response.status(404).json({message: "Application not found"});
            }
            if(application.job.postedBy._id.toString() !== userId){
                return response.status(401).json({message: "You are not authorized to update this application"});
            }
            application.status = status || application.status;
            application.notes = notes || application.notes;
            application.reviewedBy = userId;
            application.reviewedAt = new Date();
            await application.save();
            return response.status(200).json({message: "Application status updated successfully", application});
        }
        catch(error){
            return response.status(500).json({message: "Failed to update application status", error: error.message});
        }
    },
    getApplicationById: async (request, response)=>{
        try{
            const {applicationId} = request.params;
            const userId = request.userId;
            const application = await Application.findById(applicationId)
                .populate({
                    path: 'job',
                    populate:{
                        path: 'company',
                        select: 'name logo'
                    }
                })
                .populate('reviewedBy', 'name email');
            if(!application){
                return response.status(404).json({message: "Application not found"});
            }
            if(application.applicant.toString()!== userId && application.job.postedBy.toString() !== userId){
                return response.status(401).json({message: "You are not authorized to view this application"});
            }
            return response.status(200).json({message: "Application fetched successfully", application});
        }
        catch(error){
            return response.status(500).json({message: "Failed to get application by id", error: error.message});
        }
    }
}
module.exports = applicationController;