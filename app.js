const express = require('express');
const {MongoClient, ObjectId} = require('mongodb');
const app = express();
app.use(express.json());

const url = 'mongodb://localhost:27017/';
const configs = { useUnifiedTopology: true };

//db
let db;
MongoClient.connect(url,configs,(error,client)=>{
    if(!error){
        app.listen(3000, () => {
            console.log('server is counect at 3000 port');
        });

        db = client.db('student');
    }
});



app.get('/student', (req,res)=>{
    let student = [];
    db.collection('info')
      .find()
      .sort({marks: 1})
      .forEach(element => {
        student.push(element);
      })
      .then(()=>{
        res.status(200).json(student);
      })
      .catch(()=>{
        res.status(500).json({mssg:"Database not connected"});
      });
});

app.get('/student/:id', (req,res)=>{

    if (ObjectId.isValid(req.params.id)) {
        db.collection('info')
            .findOne({_id: ObjectId(req.params.id)})
            .then((ele)=>{
                res.status(200).json(ele);
            })
            .catch(()=>{
                res.status(500).json({mssg:"Database not connected"});
            });
    } else {
        res.status(500).json({mssg:"Not valid _id"});
    }
    
});

//post
app.post('/student', (req,res)=>{
    let info = req.body;
    db.collection('info')
      .insertOne(info)
      .then(()=>{
        res.status(201).json(info);
      })
      .catch(()=>{
        res.status(500).json({mssg:"Database not inselted"});
      });
});

app.get('/student', (req,res)=>{
   
    let limit = req.query.l || 0;
    let scep = 3;

    let student = [];

    db.collection('info')
      .find()
      .sort({marks: 1})
      .skip(limit*scep)
      .limit(limit)
      .forEach(element => {
        student.push(element);
      })
      .then(()=>{
        res.status(200).json(student);
      })
      .catch(()=>{
        res.status(500).json({mssg:"Database not connected"});
      });
});
