const express = require('express');
const { body } = require('express-validator');
const User = require('../models/user');
const router = express.Router();
const authController = require('../controllers/auth');

router.put('/signup', [
    // Validating user email
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom((value, { req }) => {
        return User.findOne({ email: value})
        .then(userDoc=>{
            if(userDoc){
                return Promise.reject('Email address already exists!');
            }
        })
    })
    .normalizeEmail(),
    // Validating user password
    body('password')
    .trim()
    .isLength({min: 5}),
    // Validating user name
    body('name')
    .trim()
    .not()
    .isEmpty()
], authController.signUp);

router.post('/login', authController.login);

module.exports = router;