const authController = {
    register:(request, response) =>{
        try{
            return response.status(200).json({message:"User registered successfully"});
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