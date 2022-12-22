const express = require('express');
const router = express.Router();

//import controllers
const userController = require('../controllers/user');

//import middelware
const auth = require('../middlewares/auth');

//Router Handellers 
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/logout', userController.logOut);
router.get('/getuser', auth.protect, userController.getUser);
router.get('/loginstatus', userController.logingStatus);
router.patch('/updateuser', auth.protect, userController.updateUser);
router.patch('/changepassword', auth.protect, userController.changePassword);
router.post('/forgetpassword', userController.forgetPassword);
router.put('/resetpassword/:resetToken', userController.resetPassword);
 
//route exports
module.exports = router;