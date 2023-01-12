const express = require('express');
const contactController = require('../controllers/contact');
const router = express.Router();
const auth = require('../middlewares/auth');

router.post('/contact', auth.protect, contactController.contact); 

module.exports = router;