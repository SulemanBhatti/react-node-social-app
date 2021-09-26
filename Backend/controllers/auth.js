const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

// Valdiate user signup information and create the user in DB
exports.signUp = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty){
        const error = new Error(' Validation Failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    bcrypt
      .hash(password, 12)
      .then(hashedPassword => {
          const user = new User({
              email: email,
              password: hashedPassword,
              name: name
          });
         return user.save();
      })
      .then(result=>{
          res.status(201).json({message: 'User created!', userId: result._id});
      })
      .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
      })
};

exports.login = (req, res, next) => {
    email = req.body.email;
    const password = req.body.password;

    User.findOne({email: email})
    .then(user =>{
        if(!user){
            const error = new Error('A user with this email does not exist');
            error.statusCode = 401;
            throw error;
        }
        loadedUser = user;
        return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
        //check if encrypt password matches with backend DB
        if(!isEqual){
            const error = new Error('Wrong password!');
            error.statusCode = 401;
            throw error;
        }
        //get JWT token and send it in response to Frontend for login atuh purpose
        const token = jwt.sign({
            email: loadedUser.email,
            userId: loadedUser._id.toString()
        },'secret', { expiresIn: '1h'  });
        res.status(200).json({ token: token, userId: loadedUser._id.toString() })
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
      })
}