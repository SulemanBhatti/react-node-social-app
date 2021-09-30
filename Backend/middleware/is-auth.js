const jwt = require('jsonwebtoken');

//Check authorization and verify using JWT then send response if authenticated
module.exports = ( req, res, next ) =>{
    const authHeader = req.get('Authorization');
    if(!authHeader) {
        const error = new Error('Not authenticated');
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'secret');
    } catch (err){
        err.statusCode = 500;
        throw err;
    } 
    if(!decodedToken) {
        const error = new Error('Not authenticated');
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId;
    next();
};