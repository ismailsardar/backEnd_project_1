const express = require('express');
const router = express.Router();
const fileUp = require('../controllers/prodact');
const auth = require('../middlewares/auth');
const upload = require('../utils/fileDmo');

router.post('/CrPr', auth.protect, upload.single("image"), fileUp.creatProdaet); 
router.patch('/UtPr/:id', auth.protect, upload.single("image"), fileUp.updatePre); 
router.get('/allPro', auth.protect, fileUp.getProduct); 
router.get('/singlePro/:id', auth.protect, fileUp.getSengelPre); 
router.delete('/deletePro/:id', auth.protect, fileUp.deletePre); 

module.exports = router;