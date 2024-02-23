const jwt = require("jsonwebtoken");

module.exports = async (request, response, next) => {
    try{
        //get the token from the authorization header
        const token = await request.headers.authorization.split(" ")[1]; 

        //check if the token matches the supposed origin 
        const decodedToken = await jwt.verify(
            token, 
            "RANDOM-TOKEN"
        )

        //retrieve user details of the logged in user 
        const user = await decodedToken;
        request.user = user;
        next();

    }catch(error){
        response.status(401).json({
           error: new Error("Invalid request")
        })
    }
}