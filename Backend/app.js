const express = require('express');
const feedRoutes = require('./routes/feed');
const mongoose = require('mongoose');
const app = express();

app.use(express.json()); //application/json
const MONGODB_URI = 'mongodb://ahmad1:p2K6S5mmpktG4KfI@cluster0-shard-00-00.xmre6.mongodb.net:27017,cluster0-shard-00-01.xmre6.mongodb.net:27017,cluster0-shard-00-02.xmre6.mongodb.net:27017/messages?ssl=true&replicaSet=atlas-9tacbu-shard-0&authSource=admin&retryWrites=true&w=majority';

app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();    
});

app.use('/feed', feedRoutes);

mongoose.connect(MONGODB_URI)
.then(result=>{
    app.listen(8080);
})
.catch(err=>console.log(err));

app.listen(8080);