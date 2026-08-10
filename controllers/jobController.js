const Job = require('../models/job');
const Application = require('../models/application');
const jobController = {
    getAllJobs: async (request, response) =>{
        try{
            const {page = 1, limit = 10, search, location, jobType, experienceLevel} = request.query;
            const query = {
                isActive: true,
            };
            if(search){
                query.$or = [
                    {title: {$regex: search, $options: 'i'}},
                    {description: {$regex: search, $options: 'i'}},
                    {skills: {$in: [new RegExp(search, 'i')]}}
                ]
            }
            if(location){
                query.location = {$regex: location, $options: 'i'};
            }
            if(jobType){
                query.jobType = jobType;
            }
            if(experienceLevel){
                query.experienceLevel = experienceLevel;
            }
            const jobs = await Job.find(query)
                .populate('company', 'name logo location, industry')
                .populate('postedBy', 'name email')
                .sort({createdAt: -1})
                .limit(limit * 1)
                .skip((page-1)*limit);
            const total = await Job.countDocuments(query);
            return response.status(200).json({
                jobs,
                totalPages : Math.ceil(total/limit),
                currentPage: page,
                totalJobs: total
            });
        }
        catch(error){
            return response.status(500).json({message: error.message});
        }
    },
    getJobById: async (request, response) =>{
        try{
            const {id} = request.params;
            const job = await Job.findById(id)
                .populate('company', 'name logo location industry website description')
                .populate('postedBy', 'name email')
            if(!job){
                return response.status(404).json({message: "Job not found"});
            }

            return response.status(200).json({message: "Job fetched successfully", job: job});
        }
        catch(error){
            return response.status(500).json({message: error.message});
        }

    },
    createJob: async (request, response) =>{
        try{
            const {title, description, requirements, salary, location, jobType, experienceLevel, skills, company, postedBy, applicationDeadline} = request.body;
            const job = new Job({
                title,
                description,
                requirements : requirements || [],
                salary,
                location,
                jobType,
                experienceLevel,
                skills : skills || [],
                company : request.user.assignedCompany,
                postedBy : request.userId,
                applicationDeadline
            });
            const savedJob = await job.save();
            const populateJob = await Job.findById(savedJob._id)
                .populate('company', 'name logo location industry website description')
                .populate('postedBy', 'name email');
            return response.status(201).json({job: populateJob, message: "Job created successfully"});
        }
        catch(error){
            return response.status(500).json({message: error.message});
        }
    },
    updateJob: async (request, response) =>{
        try{
            const {id} = request.params;
            const updates = request.body;
            const updatedJob = await Job.findByIdAndUpdate(id, updates, {new : true});
            if(!updatedJob){
                return response.status(404).json({message: "Job not found"});
            }
            return response.status(200).json({message: "Job updated successfully", updatedJob});
        }
        catch(error){
            return response.status(500).json({message: error.message});
        }
    },
    deleteJob: async (request, response) =>{
        try{
            const {id} = request.params;
            const job = await Job.findByIdAndDelete(id);
            if(!job){
                return response.status(404).json({message: "Job not found"});
            }
            return response.status(200).json({message: "Job deleted successfully". job});
        }
        catch(error){
            return response.status(500).json({message: error.message});
        }
    },
    getRecruiterJobs: async (request, response) =>{
        try{
            const jobs = await Job.find({postedBy: request.userId})
                .populate('company', 'name logo location industry')
                .populate('postedBy', 'name email')
                .sort({createdAt : -1});
            return response.status(200).json({message: "Recruiter jobs fetched successfully", jobs});
        }
        catch(error){
            return response.status(500).json({message: error.message});
        }
    },
    getJobApplications: async (request, response) =>{
        try{
            const {id} = request.params;
            const job = await Job.findOne({_id: id, postedBy:request.userId});
            if (!job){
                return response.status(404).json({message: "Job not found or you are not authorized to view applications"});
            }
            const applications = await Application.find({job: id})
                .populate('applicant', 'name email phone resume profilePicture bio skills experience location')
                .populate('job','title')
                .sort({AppliedAt: -1});
            return response.status(200).json({message: "Job applications fetched successfully", applications});
        }
        catch(error){
            return response.status(500).json({message: error.message});
        }
    }
}
module.exports = jobController;