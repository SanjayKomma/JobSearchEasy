const bcrypt = require('bcrypt');
const User = require('../models/user');
const { sendMail } = require('../utils/email');
const { SALT_ROUNDS, JWT_SECRET, ENV } = require('../utils/config');
const jwt = require('jsonwebtoken');
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
            await sendMail("sanju.komma2@gmail.com", "JobSearchEasy", `Welcome to JobSearchEasy, ${name}!`);
            return response.status(201).json({message:"User registered successfully"});
        }
        catch(error){
            return res.status(500).json({error:error.message});
        }
    },
    login: async (request, response) =>{
        try{
            const {email, password} = request.body;
            const user = await User.findOne({ email });
            if(!user){
                return response.status(400).json({message:"Invalid Email or User not found"});
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if(!isPasswordValid){
                return response.status(400).json({message:"Invalid password"});
            }
            const token = jwt.sign({ userId:user._id }, JWT_SECRET, { expiresIn: '1h' });
            response.cookie('token', token, {
                httpOnly: true,
                secure: ENV === 'production',
                sameSite: ENV === 'production' ? 'none' : 'lax',
                maxAge: 3600000
            });
            return response.status(200).json({message:"User logged in successfully"});
        }
        catch(error){
            return response.status(500).json({error:error.message});
        }
    },
    getProfile: async (request, response) =>{
        try{
            const userId = request.userId;
            const user = await User.findById(userId).select('-password -__v');
            response.status(200).json({user});
        }
        catch(error){
            return res.status(500).json({error:error.message});
        }
    },
    logout:async (request, response) =>{
        try{
            response.clearCookie('token',{
                httpOnly: true,
                secure: ENV === "production",
                sameSite: ENV === "production" ? "none" : "lax"
            });
            return response.status(200).json({message:"User logged out successfully"});
        }
        catch(error){
            return res.status(500).json({error:error.message});
        }
    },
    uploadProfilePicture: async (request, response) => {
        try{
            if(!request.file){
                return response.status(400).json({message:"No file uploaded"});
            }
            const user = await User.findByIdAndUpdate(request.userId, {profilePicture:request.file.path}, {new:true}).select('-password');
            return response.status(200).json({message:"Profile picture uploaded successfully"}, user);
        }
        catch(error){
            return response.status(500).json({error:error.message});
        }
    },
    uploadResume: async (request, response) => {
        try{
            if(!request.file){
                return response.status(400).json({message:"No file uploaded"});
            }
            const user = await User.findByIdAndUpdate(request.userId, {resume:request.file.path}, {new:true}).select('-password');
            return response.status(200).json({message:"Resume uploaded successfully"}, user);
        }
        catch(error){
            return response.status(500).json({error:error.message});
        }
    }
}
module.exports = authController;