const express = require('express');
const { body } = require('express-validator');
const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// GET /feed/posts
router.get('/posts', isAuth, feedController.getPosts);

// POST /feed/posts
router.get('/post/:postId', isAuth, feedController.getPost);

// /feed/post Create new post sent by user
router.post('/post', isAuth, [
    body('title').trim().isLength({min:5}),
    body('content').trim().isLength({min:5})
], feedController.createPost);

// POST/feed/post/postId to update specific post
router.put('/post/:postId', isAuth, [
    body('title').trim().isLength({min:5}),
    body('content').trim().isLength({min:5})
], feedController.updatePost);

router.delete('/post/:postId', isAuth, feedController.deletePost);

module.exports = router;
