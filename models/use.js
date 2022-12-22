const mongoose = require('mongoose');
const dcrypt = require('bcryptjs');

const userScema = mongoose.Schema(
    {
        name:{
            type:String,
            required: [true, "plese add A name"]
        },
        email:{
            type:String,
            required: [true, "please Add your emile"],
            unique: true,
            trim: true,
            match: [/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i, "please enter a valide emile"],
        },
        password:{
            type:String,
            required: [true, "Enter A valide emile"],
            minLength: [6, "password must be up 6 creacters"],
            // maxLength: [26, "password must not be more than 26 creacters"]
        },
        photo:{
            type:String,
            required: [true, "Plese Add A photo"],
            default: "https://i.ibb.co/4pDNDk1/avatar.png",
        },
        phone:{
            type:Number,
            required: [true, "Enter your mobile number"],
            default: "01980420",
        },
        bio:{
            type:String,
            default: "I am a web Developar",
            maxLength: [250, "Bio mut not be 250 creacters!"],
        },
    },
    {
        timestamps: true, 
        versionKey: false,
    }
);

//Encrypt password before data save DB
userScema.pre("save", async function(next) {
    if(!this.isModified("password")){
        return next();
    }
    
    //Hash password
    const selth = await dcrypt.genSalt(19);
    const hashedPassword = await dcrypt.hash(this.password, selth);
    this.password = hashedPassword;
    next();
});
 
//secma counect
const User = mongoose.model('User', userScema);
 
//export secma
module.exports = User;
