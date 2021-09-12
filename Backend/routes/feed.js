const express = require('express');
const { body } = require('express-validator');
const feedController = require('../controllers/feed');

const router = express.Router();

// GET /feed/posts
router.get('/posts', feedController.getPosts);

// POST /feed/posts
router.get('/post/:postId', feedController.getPost);

// /feed/post Create new post sent by user
router.post('/post', [
    body('title').trim().isLength({min:5}),
    body('content').trim().isLength({min:5})
], feedController.createPost);

// POST/feed/post/postId to update specific post
router.put('/post/:postId',[
    body('title').trim().isLength({min:5}),
    body('content').trim().isLength({min:5})
], feedController.updatePost);

router.delete('/post/:postId', feedController.deletePost);

module.exports = router;
