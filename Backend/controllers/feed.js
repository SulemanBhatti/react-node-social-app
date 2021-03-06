const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator');

const Post = require('../models/post');
const User = require('../models/user');

// Get posts from user
exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;
  let creatorName =  '';

  try {
    creatorName = await User.findById(req.userId)
  }
  catch(err){
    if(!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
  
  try{
    totalItems = await  Post.find().countDocuments();
    let posts = await Post.find()
    .skip((currentPage - 1) * perPage)
    //set limit per page and send to UI
    .limit(perPage);
    return res
      .status(200)
      .json({ message: 'Fetched posts successfully.', posts: posts, post:{creator: creatorName.name}, totalItems: totalItems });
  }catch(err){
    if(!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Create post send by user
exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  if (!req.file) {
    const error = new Error('No image provided.');
    error.statusCode = 422;
    throw error;
  }
  const imageUrl = req.file.path.replace(/\\/g, '/');;
  const title = req.body.title;
  const content = req.body.content;
  let creator;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: req.userId
  });
  post
    .save()
    .then(result =>{
      return User.findById(req.userId);
    })
    .then(user => {
      creator = user;
      user.posts.push(post);
      return user.save();
    })
    .then(result=>{
      res.status(201).json({
        message: 'Post created successfully!',
        post: post,
        creator: { _id: creator._id, name: creator.name }
      });
    })  
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

// Get post for user using Post ID
exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Could not find post.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: 'Post fetched.', post: post });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

//Update post from user
exports.updatePost = (req, res, next) => { 
  const postId = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path.replace(/\\/g, '/');
  }
  if (!imageUrl) {
    const error = new Error('No file picked.');
    error.statusCode = 422;
    throw error;
  }
  Post
  .findById(postId)
  .populate('creator')
    .then(post => {
      if (!post) {
        const error = new Error('Could not find post.');
        error.statusCode = 404;
        throw error;
      }
      // If userID does not match then do not update anything and send auth error
      if(post.creator._id.toString() !== req.userId){
        const error = new Error('Not Authorized');
        error.statusCode = 403;
        throw error;
      }
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }
      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;
      return post.save();
    })
    .then(result => {
      res.status(200).json({ 
        message: 'Post updated!', 
        post: result, 
        //send name and ID of user who created the post
        creator: { _id: result.creator._id, name: result.creator.name } 
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

//Delete post required by user
exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  
  Post.findById(postId)
  .then(post=>{
    if (!post) {
      const error = new Error('Could not find post.');
      error.statusCode = 404;
      throw error;
    }
    if(post.creator.toString() !== req.userId){
      const error = new Error('Not Authorized');
      error.statusCode = 403;
      throw error;
    }
    // Clear Image When added authentication and after checking if user is logged in!!
    clearImage(post.imageUrl);
    return Post.findByIdAndRemove(postId);
  })
  .then(res=>{
    return User.findById(req.userId)
  })
  .then(user => {
    user.posts.pull(postId);
    return user.save();
  })
  .then(result=>{
    return res.status(200)
    .json({message: 'Post has been deleted!', result: result});
  })
  .catch(err=> {
    if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}

// Delete images after they are removed from posts
const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};
