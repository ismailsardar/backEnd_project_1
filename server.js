const {readdirSync} = require('fs');
const path = require('path');
const express = require('express');
const app = express();

//require middelware
const helmet = require('helmet');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

//use middelwaer
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use('/uplodes', express.static(path.join(__dirname, 'uplodes')));
app.use(express.urlencoded({extended: false}));

//routes middelwaer
readdirSync('./routes/').map((rout) => {
    app.use('/api/v1', require(`./routes/${rout}`));
});

//poet asyne
const PORT = process.env.PORT;

//Data Base counected
mongoose.connect(process.env.DATA_BASE)
        .then((value) => {
            if(value){
                app.listen(PORT, ()=>{
                    console.log(`server runing at http://localhost:${PORT}`);
                });
            }
        })
        .catch((err)=>{
            console.log(err);
        });