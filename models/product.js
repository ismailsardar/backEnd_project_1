const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

//podaets Validetions
const productSchema = mongoose.Schema(
    {
        user:{
            type: ObjectId,
            required: true,
            ref: "User",
        },
        name:{
            type: String,
            required: [true, "Enter a product name"],
            trim: true,
        },
        sku:{
            type: String,
            required: true,
            trim: true,
            default: "SKY",
        },
        category:{
            type: String,
            required: [true, "Please Add a category"],
            trim: true,
        },
        quantity:{
            type: String,
            required: [true, "Please Add a quentity"],
            trim: true,
        },
        price:{
            type: String,
            required: [true, "Enter product price"],
            trim: true,
        },
        description:{
            type: String,
            required: [true, "Please Add a Descriptions"],
            trim: true,
        },
        image:{
            type: Object,
            default: {},
        },
    },
    {timestamps: true,versionKey: false}
);

const Product = mongoose.model("Product", productSchema);

//schema exports
module.exports = Product;