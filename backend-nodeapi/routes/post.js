
const express= require('express');
//const postController = require('../controllers/post');
//de-structuring above statement to get clean code.
const {
        getPosts,
        createPost,
        postsByUser,
        postById,
        isPoster,
        updatePost,
        deletePost,
        photo,
        singlePost,
        like,
        unlike,
        comment,
        uncomment
                } = require('../controllers/post');

const {requireSignin } = require('../controllers/auth');
const {userById } = require('../controllers/user');
const user = require('../models/user');
const {createPostValidator}= require('../validator'); // index.js file present in validator will automatically load.

const router =  express.Router() //method.

// exports.router.get('/',postController.getPosts) // Can't be used like this. Therefore use like follow:

router.get("/posts", getPosts);
//like unlike
router.put('/post/like',requireSignin, like );
router.put('/post/unlike',requireSignin, unlike );

//comments:
router.put('/post/comment',requireSignin, comment );
router.put('/post/uncomment',requireSignin, uncomment );

router.post("/post/new/:userId", requireSignin, createPost, createPostValidator);
router.get("/posts/by/:userId",requireSignin, postsByUser);
router.get("/post/:postId",singlePost);
//lec69:
router.put("/post/:postId",requireSignin, isPoster, updatePost);
//lec68:
router.delete("/post/:postId",requireSignin, isPoster, deletePost);
//photo.
router.get("/post/photo/:postId", photo);



//any route containing :userId(), our app will first execute userById();
router.param("userId", userById);

//any route containing :postById(), our app will first execute postById();
router.param("postId", postById);

module.exports = router;

// exports.getPosts = (req, res)=>{
//     res.send("Hello World from Node js");
// }


//::::::::::::::Json & Postman:::::::::::::::::::::::::::