const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

//import model
const User = require('../models/use');

//module sceffolder
const auth = {};

//protect middelwere
auth.protect = asyncHandler(async (req,res,next) => {
    // try{
        //get token
        const token = req.cookies.token;
        if(!token){
            res.status(401);
            throw new Error('Not authorized, please login >>2')
        }

        //verify token
        const velidToken = jwt.verify(token, process.env.PRIVET_KEY);

        //get user from token
        const user = await User.findById(velidToken.id).select('-password');

        if(!user){
            req.status(401);
            throw new Error('User Not found! plese login');
        }
    
        req.user = user;
        next();
    // }catch(error){
    //     res.status(401);
    //     throw new Error("Not authorized, please login >>>11");
    // }
});

//export middelwere
module.exports = auth;