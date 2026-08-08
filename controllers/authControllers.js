const bcrypt = require('bcrypt');
const User = require('../models/user');
const { SALT_ROUNDS } = require('../utils/config');
const authController = {
    register: async (request, response) =>{
        try{
            const {name, email, password} = request.body;
            const existingUser = await User.findOne({ email });
            if(existingUser){
                return response.status(400).json({message:"User already exists"});
            }
            const hashedPassword = await bcrypt.hash(password, parseInt(SALT_ROUNDS));
            const newUser = new User({
                name,
                email,
                password: hashedPassword
            });
            await newUser.save();
            return response.status(201).json({message:"User registered successfully"});
        }
        catch(error){
            return res.status(500).json({error:error.message});
        }
    },
    login:(request, response) =>{
        try{
            return response.status(200).json({message:"User logged in successfully"});
        }
        catch(error){
            return res.status(500).json({error:error.message});
        }
    },
    getProfile:(request, response) =>{
        try{
            return response.status(200).json({message:"User profile retrieved successfully"});
        }
        catch(error){
            return res.status(500).json({error:error.message});
        }
    },
    logout:(request, response) =>{
        try{
            return response.status(200).json({message:"User logged out successfully"});
        }
        catch(error){
            return res.status(500).json({error:error.message});
        }
    }
}
module.exports = authController;