const connectToMongo = require('./db');
const express = require('express');
const app=express();

connectToMongo();

app.use(express.json())

app.use('/api/user', require('./api/user'));


module.exports=app;