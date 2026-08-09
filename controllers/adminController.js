const Company = require('../models/company');
const adminController = {
    createCompany: async (request, response)=>{
        try{
            const {name, description, website, logo, industry, location, size, foundedYear} = request.body;
            const companyExists = await Company.findOne({name:name});
            if(companyExists){
                return response.status(400).json({message:"Company already exists"});
            }
            const newCompany = new Company({
                name,
                description,
                website,
                logo,
                industry,
                location,
                size,
                foundedYear,
                createdBy: request.userId
            });
            const savedCompany = await newCompany.save();
            const {__v, ...result} = savedCompany.toObject();
            return response.status(201).json({message:"Company created successfully", result});
        }
        catch(error){
            return response.status(500).json({message: error.message});
        }
    },
    getAllCompanies: async (request, response)=>{
        try{
            return response.status(200).json({message: "All companies fetched successfully"});
        }
        catch(error){
            return response.status(500).json({message: error.message});
        }

    },
    getCompanyById: async (request, response)=>{
        try{
            return response.status(200).json({message: "Company fetched successfully"});
        }
        catch(error){
            return response.status(500).json({message: error.message});
        }
    },
    updateCompany: async (request, response)=>{
        try{
            return response.status(200).json({message: "Company updated successfully"});
        }
        catch(error){
            return response.status(500).json({message: error.message});
        }
    },
    deleteCompany: async (request, response)=>{
        try{
            return response.status(200).json({message: "Company deleted successfully"});
        }
        catch(error){
            return response.status(500).json({message: error.message});
        }
    },
    createRecruiter: async (request, response)=>{
        try{
            return response.status(200).json({message: "Recruiter created successfully"});
        }
        catch(error){
            return response.status(500).json({message: error.message});
        }
    },
    getAllRecruiters: async (request, response)=>{
        try{
            return response.status(200).json({message: "All recruiters fetched successfully"});
        }
        catch(error){
            return response.status(500).json({message: error.message});
        }

    },
}
module.exports = adminController;