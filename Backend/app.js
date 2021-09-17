const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const app = express();

//Change before deployment
const MONGODB_URI = 'mongodb://ahmad1:p2K6S5mmpktG4KfI@cluster0-shard-00-00.xmre6.mongodb.net:27017,cluster0-shard-00-01.xmre6.mongodb.net:27017,cluster0-shard-00-02.xmre6.mongodb.net:27017/messages?ssl=true&replicaSet=atlas-9tacbu-shard-0&authSource=admin&retryWrites=true&w=majority';

// Setting images folder destination
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});


// Filtering images format and allowing only specific
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json()); // application/json

// storing images in images folder uploaded by User
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images')));

// App headers for authorization
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// App routes
app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

// Error handling
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

// Database connection
mongoose.connect(MONGODB_URI)
.then(result=>{
    app.listen(8080);
})
.catch(err=>console.log(err));