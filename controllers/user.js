const crypto = require('crypto')
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const decrypt = require('bcryptjs');

//import model
const User = require('../models/use');
const Token = require('../models/token');
const sendEmail = require('../utils/sendmaile');

//module secffolder
const userController = {};

//Generat Token
const generateToken = (id) => {
    return jwt.sign({id}, process.env.PRIVET_KEY, {expiresIn: '3d'});
}

//Register user
userController.registerUser = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body;

    //Validation
    if(!name || !email || !password){
        res.status(400)
        throw new Error('Please fill in all require fileds')
    }
    //password Validation
    if(password.length < 6){
        res.status(400);
        throw new Error('password mast be up 6 charactars')
    }

    //veryfi use is already exists
    const userExists = await User.findOne({email});
    if(userExists){
        res.status(400);
        throw new Error('Email has already use');
    }

    //newUser created
    const newUser = await User.create(
        {
            name,
            email,
            password,
        }
    );

    //Generat Token
    const token = generateToken(newUser._id);

    //set cookie
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1 day
        sameSite: "none",
        secure: true,
    });

    //user Doucument respons
    if (newUser) {
        const {_id, name, email, photo, phone, bio} = newUser;

        //show user Data
        res.status(201).json({
            _id,
            name,
            email,
            phone,
            photo,
            bio,
            token,
        });
    } else {
        res.status(400);
        throw new Error('Envlide Users Data');
    }
});

//loginUser
userController.loginUser = asyncHandler(async (req, res) => {
    //user input 
    const {email, password} = req.body;

    //validetions
    if(!email || !password){
        res.status(400);
        throw new Error('Please Enter email and password');
    }

    //user verify
    const userExists = await User.findOne({email});

    if(!userExists){
        res.status(400);
        throw new Error('user not found, Please singup');
    }

    //password verify
    const passwordIsCorrect = await decrypt.compare(password, userExists.password);
    
    //token generate
    const token = generateToken(userExists._id);

    //send cookie
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1 day
        sameSite: "none",
        secure: true,
    });

    //user respons
    if (userExists && passwordIsCorrect) {
        const {_id, name, email, photo, phone, bio} = userExists;

        res.status(200).json({
            _id,
            name,
            email,
            phone,
            photo,
            bio,
            token,
        });
    } else {
        res.status(400);
        throw new Error("Invaled email and password");
    }
});

//logout
userController.logOut = asyncHandler(async (req, res) => {
    res.cookie('token', '', {
        path: '/',
        httpOnly: true,
        expires: new Date(0),
        sameSite: 'none',
        secure: true,
    });
    return res.status(200).json({message : 'Successfully logOut'});
});

//getUser Data
userController.getUser = asyncHandler(async (req, res) => {
    //find user
    const user = await User.findById(req.user._id);

    //respons
    if (user) {
        const {_id, name, email, photo, phone, bio} = user;
        res.status(200).json(
            {
                _id,
                name,
                email,
                photo,
                phone,
                bio,
            }
        );
    } else {
        res.status(400)
        throw new Error('User not found!');
    }
});

// get login status
userController.logingStatus = asyncHandler(async (req, res) => {
    //get token from cookies
    let token = req.cookies.token;

    if(!token){
        return res.json(false);
    }

    //verify token
    const verifyToken = jwt.verify(token, process.env.PRIVET_KEY);

    if (verifyToken) {
        return res.json(true);
    } else {
        return res.json(false);
    }
});

//updateUser
userController.updateUser = asyncHandler(async (req, res) => {
    //find user
    const user = await User.findById(req.body._id);

    //date update
    if (user) {
        const {name, email, photo, phone, bio} = user;

        //data from body
        user.email = email;
        user.name = req.body.name || name;
        user.phone = req.body.phone || phone;
        user.photo = req.body.photo || photo;
        user.bio = req.body.photo || bio;

        //data save
        const updateUser = await user.save();

        //user response
        res.status(201).json({
            _id: updateUser._id,
            name: updateUser.name,
            phone: updateUser.phone,
            email: updateUser.email,
            photo: updateUser.photo,
            bio: updateUser.bio,
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

//Password Change
userController.changePassword = asyncHandler(async (req, res) => {
    //user define
    const user = await User.findById(req.user._id);
    const {oldPassword, newPassword} = req.body;

    //verify
    if(!user){
        res.status(400);
        throw new Error('User Not find! Pleas sineup');
    }

    if(!oldPassword || !newPassword){
        res.status(400);
        throw new Error('Plese Enter oldPassword and NewPassword')
    }

    //check oldPassword match DB password
    const passwordIsCorrect = await decrypt.compare(oldPassword, user.password);
    
    //save newPassword
    if (user && passwordIsCorrect) {
        user.password = newPassword;
        user.save();

        //user respons
        res.status(200).send('Password change successfuly');
    } else {
        res.status(400);
        throw new Error('oldPassword is incorrect!');
    }
});

//forget Password
userController.forgetPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
   
    const user = await User.findOne({ email });
    if(!user){
        res.status(404);
        throw new Error('user not exgit');
    }

    //Delete token if the token exgit in DB
    const token = await Token.findOne({userId: user._id});
   
    if(token){
        await token.deleteOne();
    }

    //creat reset token
    const resetToken = crypto.randomBytes(32).toString('hex') + user._id;
    console.log(resetToken);
    //hesed token
    const hashedToken = crypto.createHash('sha256')
                             .update(resetToken)
                             .digest('hex');
    //save Data user DB
    console.log(hashedToken);

    await new Token({
        userId: user._id,
        token: hashedToken,
        createdAt: Date.now(),
        expiresAt: Date.now() + 30 * (60 * 1000),
    }).save();
 
    //Reset password url
    const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
    // console.log(resetUrl)
    //message
    const message = `
        <h2>Hello ${user.name}</h2>
        <p>Please use the URL below for reset password</p>
        <p>This link will valid for 30 minites</p>
        <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        <p>Regards...</p>
        <p>Pinvent Team</p>
    `;
    
    //nodemeiler proparty
    const subject = 'Password reset request';
    const send_to = user.email;
    const sent_from = process.env.EMAIL_USER;

    //sendEmail
    try {
        await sendEmail(subject, message, send_to, sent_from);
        res.status(200).json({seccess: true, message: 'Reset email sent'});
    } catch (error) {
        res.status(500);
        throw new Error('Email not sent, Plese try agine');
    }
});

//reset Password
userController.resetPassword = asyncHandler(async (req, res) => {
    const {newPassword} = req.body;
    const {resetToken} = req.params;

    //hashed token then compeair
    const hashedToken = crypto.createHash('sha256')
                              .update(resetToken)
                              .digest('hex');

    //find token DB
    const userToken = await Token.findOne({
        token: hashedToken,
        expiresAt: {$gt: Date.now()},
    });  
    
    if(!userToken){
        res.status(40);
        throw new Error('Token is expire');
    }

    //find user with user token userId
    const user = await User.findOne({_id: userToken.userId});
    user.password = newPassword;

    //save password
    await user.save();

    //response
    res.status(201).json({
        message:'Password reset Successful, Plese login',
    });
});

//export userRouter
module.exports = userController;