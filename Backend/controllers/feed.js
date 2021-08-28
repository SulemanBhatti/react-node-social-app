const { validationResult } = require('express-validator');

exports.getPosts = (req, res, next) =>{
    res.status(200).json({
        posts: [
          {     
              _id: '1',
              title: 'First Post', 
              content: 'This is first post', 
              imageUrl: 'images/picture.png',
              creator: {
                  name: 'Suleman'
              },
              createdAt: new Date()
          }
        ]
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
    res.status(201).json({
        message: 'Post created sucessfully!',
        post: {
            id: new Date().toISOString(), 
            title: title, 
            content: content,
            creator: {name: 'Suleman'},
            createdAt: new Date()
        }
    });
}