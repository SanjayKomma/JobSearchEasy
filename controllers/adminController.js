const Company = require('../models/company');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const {SALT_ROUNDS} = require('../utils/config');
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
            const companies = await Company.find().populate('createdBy', 'name email');

            return response.status(200).json({message: "All companies fetched successfully", result: companies});
        }
        catch(error){
            return response.status(500).json({message: error.message});
        }

    },
    getCompanyById: async (request, response)=>{
        try{
            const {id} = request.params;
            const company = await Company.findById(id).populate('createdBy', 'name email');
            if(!company){
                return response.status(404).json({message: "Company not found"});
            }
            return response.status(200).json({message: "Company fetched successfully", result: company});
        }
        catch(error){
            return response.status(500).json({message: error.message});
        }
    },
    updateCompany: async (request, response)=>{
        try{
            const {id} = request.params;
            const {name, description, website, logo, industry, location, size, foundedYear} = request.body;
            const company = await Company.findByIdAndUpdate(id, {
                name,
                description,
                website,
                logo,
                industry,
                location,
                size,
                foundedYear
            }, {new: true});
            if(!company){
                return response.status(404).json({message: "Company not found"});
            }
            return response.status(200).json({message: "Company updated successfully", result: company});
        }
        catch(error){
            return response.status(500).json({message: error.message});
        }
    },
    deleteCompany: async (request, response)=>{
        try{
            const {id} = request.params;
            const company = await Company.findByIdAndDelete(id);
            if(!company){
                return response.status(404).json({message: "Company not found"});
            }
            return response.status(200).json({message: "Company deleted successfully", result:company});
        }
        catch(error){
            return response.status(500).json({message: error.message});
        }
    },
    createRecruiter: async (request, response)=>{
        try{
            const {id} = request.params;
            const {name, email, password} = request.body;
            const user = await User.findOne({email:email});
            if(user){
                return response.status(400).json({message: "User already exists"});
            }
            const company = await Company.findById(id);
            if(!company){
                return response.status(404).json({message: "Company not found"});
            }
            const hashedPassword = await bcrypt.hash(password, parseInt(SALT_ROUNDS));
            const newUser = new User({
                name,
                email,
                password: hashedPassword,
                role: 'recruiter',
                assignedCompany: company._id
            });
            const savedUser = await newUser.save();
            const {__v, ...result} = savedUser.toObject();
            if(!savedUser){
                return response.status(400).json({message: "Recruiter creation failed"});
            }
            return response.status(200).json({message: "Recruiter created successfully", result});
        }
        catch(error){
            return response.status(500).json({message: error.message});
        }
    },
    getAllRecruiters: async (request, response)=>{
        try{
            const {id } = request.params;
            const company = await Company.findById(id);
            if(!company){
                return response.status(404).json({message: "Company not found"});   
            }
            const recruiters = await User.find({assignedCompany:company._id}).select('-password -__v');
            return response.status(200).json({message: "All recruiters fetched successfully", result: recruiters});
        }
        catch(error){
            return response.status(500).json({message: error.message});
        }
    },
}
module.exports = adminController;