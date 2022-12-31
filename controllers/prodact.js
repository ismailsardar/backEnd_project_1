const asyncHandler = require("express-async-handler");
const Product = require('../models/product');
const multer = require('multer');

//module scffoder
const fileUp = {};

//create Prodact
fileUp.creatProdaet = asyncHandler(async (req, res) =>{
    const {name, sku, category, quantity, price, description} = req.body;

    if(!name|| !sku|| !category|| !quantity|| !price|| !description){
       res.status(404);
       throw new Error("Please full the all field"); 
    }

    //hendel image uplode
    let fileData = {};
    if(req.file){
        fileData = {
            fileName: req.file.originalname,
            filePath: req.file.path,
            fileType: req.file.mimetype,
            fileSize: req.file.size
        };
    }

    //prodact creadet
    const prodact = await Product.create({
        user: req.user.id,
        name,
        sku,
        category,
        quantity,
        price,
        description,
        image: fileData,
    });

    res.status(201).json(prodact);
    
});

//get all products user:user.id
fileUp.getProduct = asyncHandler(async (req, res) => {
    const products = await Product.find({user:req.user.id}).sort("-createdAt");

    res.status(200).json(products);
});

//get singel products
fileUp.getSengelPre = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if(!product){
        res.status(404);
        throw new Error('Product not found');
    }

    if(product.user.toString() !== req.user.id){
        res.status(401);
        throw new Error('User not authorized')
    }

    res.status(200).json(product);
});

//delete products
fileUp.deletePre = asyncHandler(async (req, res) =>{
    const product = await Product.findById(req.params.id);

    if(!product){
        res.status(404);
        throw new Error('Product not found');
    }

    if(product.user.toString() !== req.user.id){
        res.status(401);
        throw new Error('User not authorized')
    }

    await product.remove();
    res.status(200).json({message:"Product Delete success"});
});

//update product
fileUp.updatePre = asyncHandler(async (req, res) =>{
    const {name, sku, category, quantity, price, description} = req.body;
    const {id} = req.params;
    
    const product = await Product.findById(id);

    //veryfi
    if(!product){
        res.status(404);
        throw Error('Product not founds');
    }

    if(product.user.toString() !== req.user.id){
        res.status(401);
        throw new Error('User not authorized')
    }

    //handel image
    let fileData = {};
    if(req.file){
        fileData =  {
            fileName: req.file.originalname,
            filePath: req.file.path,
            fileType: req.file.mimetype,
            fileSize: req.file.size,
        };
    }

    //update Product const updateProduct = 
    const updateProduct = await Product.findByIdAndUpdate(
        {_id:id},
        { 
            name,
            sku,
            category, 
            quantity, 
            price, 
            description,
            image: Object.keys(fileData).length === 0 ? product.image : fileData,
        },
        {
            new:true,
            runValidators:true,
        },
        // function(err, dosc) {
        //     if (!err) {
        //         res.status(201).json(dosc);
        //     } else {
        //         res.status(500);
        //         console.log(err);
        //     }
        // }
    );

    res.status(201).json(updateProduct)
});

module.exports = fileUp;