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
    //Create in database
    const title = req.body.title;
    const content = req.body.content;
    console.log(req.body.title)
    res.status(201).json({
        message: 'Post created sucessfully!',
        post: {
            id: new Date().toISOString(), 
            title: title, 
            content: content
        }
    });
}