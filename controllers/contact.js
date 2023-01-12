const asyncHandler = require("express-async-handler");
//import model
const User = require('../models/use');
const sendEmail = require('../utils/sendmaile');
//module scffoder
const contactController = {};

contactController.contact = asyncHandler(async (req, res) => {
    const {subject, message} = req.body;
   
    const user = await User.findOne(req.user._id);
    if(!user){
        res.status(404);
        throw new Error('user not exgit');
    }
    //user input validate
    if (!subject || !message) {
        res.status(404);
        throw new Error('Please subject and message field');
    }

    //nodemeiler proparty
    const send_to = process.env.EMAIL_AUTHOR;
    const sent_from = process.env.EMAIL_USER;
    const reply_to = user.email;
    //sendEmail
    try {
        await sendEmail(subject, message, send_to, sent_from,reply_to);
        res.status(200).json({seccess: true, message: 'E-mail sent! Please check E-mail'});
    } catch (error) {
        res.status(500);
        throw new Error('Email not sent, Plese try agine');
    }
});

module.exports = contactController;