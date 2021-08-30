const { validationResult } = require('express-validator');
const Post = require('../models/post');

exports.getPosts = (req, res, next) =>{
    Post.find()
    .then(posts => {
        res.status(200).json({message: 'Fetched posts successfully.', posts: posts})
    })
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res
        .status(422)
        .json({
                message: 'Validation failed, entered data is not correct',
                errors: errors.array()
            });
    }
    const title = req.body.title;
    const content = req.body.content;

    const post = new Post({
        title: title, 
        content: content,
        imageUrl: 'images/picture.png',
        creator: {name: 'Suleman'},
    });
    post.save()
    .then(result=>{
        console.log(result);
        res.status(201).json({
            message: 'Post created sucessfully!',
            post: result
        });
    })
    .catch(err=>console.log(err));
}

exports.getPost = (req, res, next) =>{
    const postId = req.params.postId;
    Post.findById(postId)
    .then(post => {
        if(!post){
            const error = new Error('Could not found any post.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({message: 'Post fetched.', post: post});
    })
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
}
        