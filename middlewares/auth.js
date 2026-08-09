const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
const User = require('../models/user');
const isAuthenticated = async (request, response, next) => {
    const token = request.cookies && request.cookies.token
    if (!token){
        return response.status(401).json({message:"User is not authenticated"});
    }
    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.userId;
        request.userId = userId;
        next();
    }
    catch(error){
        return response.status(401).json({message:"Unauthorized access"});
    }
}
const allowRoles = (roles) => {
    return async (request, response, next) => {
        const userId = request.userId;
        const user = await User.findById(userId);
        if (!user){
            return response.status(401).json({message:"User not found"});
        }
        if(!roles.includes(user.role)){
            return response.status(403).json({message:"forbidden: You do not have permission to access this resource"});
        }
        request.user = user;
        next();
    }
}
module.exports = {
    isAuthenticated,
    allowRoles
}