const jobController = {
    getAllJobs: async (request, response) =>{
        try{
            return response.status(200).json({message: "All jobs fetched successfully"});
        }
        catch(error){
            return response.status(500).json({message: error.message});
        }
    },
    getJobById: async (request, response) =>{
        try{
            return response.status(200).json({message: "Job fetched successfully"});
        }
        catch(error){
            return response.status(500).json({message: error.message});
        }

    },
    createJob: async (request, response) =>{
        try{
            return response.status(201).json({message: "Job created successfully"});
        }
        catch(error){
            return response.status(500).json({message: error.message});
        }
    },
    updateJob: async (request, response) =>{
        try{
            return response.status(200).json({message: "Job updated successfully"});
        }
        catch(error){
            return response.status(500).json({message: error.message});
        }
    },
    deleteJob: async (request, response) =>{
        try{
            return response.status(200).json({message: "Job deleted successfully"});
        }
        catch(error){
            return response.status(500).json({message: error.message});
        }
    },
    getRecruiterJobs: async (request, response) =>{
        try{
            return response.status(200).json({message: "Recruiter jobs fetched successfully"});
        }
        catch(error){
            return response.status(500).json({message: error.message});
        }
    },
    getJobApplications: async (request, response) =>{
        try{
            return response.status(200).json({message: "Job applications fetched successfully"});
        }
        catch(error){
            return response.status(500).json({message: error.message});
        }
    }
}
module.exports = jobController;