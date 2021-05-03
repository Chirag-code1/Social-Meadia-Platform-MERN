
const Post = require('../models/post');
const formidable = require('formidable');
const fs = require('fs') //core nodeJs module
// exports.getPosts = (req, res)=>{
//     res.send("Hello World from Node js");
// }
const _ = require('lodash'); //lec69
let uuidv1 = require('uuidv1');
 console.log(uuidv1());
//::::::::::::::JSON & Postman:::::::::::::::::::::::

//lec67:
exports.postById =(req, res, next, id)=>{
    Post.findById(id)
    .populate("postedBy","_id name")
    .populate('commemts', 'text created')
    .populate('comments.postedBy', '_id name')
    .exec((err, post)=>{
        if(err || !post){
            return res.status(400).json({
                error: err
            })
        }
        req.post = post
        next()
    })
}



exports.getPosts = (req, res)=>{
    // res.json({
    //     posts: [{ title: "First Post" },{title: "Second post"}]
    // });

    //getting posts from database:
    const posts = Post.find()
    .populate("postedBy","_id name")
    .populate('commemts', 'text created')
    .populate('comments.postedBy', '_id name')
    .select("_id title body created likes")
    .sort({created: -1 })
    // const posts = Post.find().select("_id title body") //find()=> finds all from database. //select()=>helps us to coustimize our response by providing us power of showing what we wanted to show in response rather all.
    .then(posts=>{
        res.status(200).json(posts); //.status(200) is optional here, coze by default express sends staus as 200.
            
       
    })
    .catch(err => console.log(err));
};


exports.createPost = (req,res,next) => {
   //lec62
    let form  = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files)=>{
        if(err){
            return res.status(400).json({
                error: "Image could not be uploaded"
            });
        }
        let post = new Post(fields);

        req.profile.hashed_password = undefined;
        req.profile.salt = undefined;
        post.postedBy = req.profile;

        if(files.photo){
            post.photo.data = fs.readFileSync(files.photo.path);
            post.photo.contentType = files.photo.type;
        }
        post.save((err,result)=>{
            if(err){
                return res.status(400).json({error: err});
            }
            res.json(result);
        });
    });
};
    //lec66 me delete krdiya->
    //  const post = new Post(req.body);
    // console.log("CREATING POST:", req.body);
    
 // saving in database.
//  post.save((err, result)=>{
//     if(err){
//         return res.status(400).json({
//             error: err
//         });
//     } // end of if.

//     res.status(200).json({
//         post: result
//     });
// });
// post.save()
// .then(result =>{
//     res.status(200).json({ //.status(200) is optional here, coze by default express sends staus as 200.
//         post:result
//     });
// });
   
//}

//lec65:
exports.postsByUser = (req,res) => {
    Post.find({postedBy: req.profile._id})
    .populate("postedBy","_id name")
    .select("_id title body created likes")
    .sort("_created")
    .exec((err, posts)=>{
        if(err){
        return res.status(400).json({
            error: err
        })
    }
    res.json(posts);
    });
};


//lec68:
// Buildig isPoster() and deletePost() methods:

exports.isPoster = (req, res, next) =>{
    let isPoster =req.post && req.auth && req.post.postedBy._id == req.auth._id// ths will return true or false.
    if(!isPoster){
        return res.status(401).json({
            error:"User is not authorized"
        })
    }
    next()
}

//lect69:// this is almost same as we did in updating user in user.js (controllers).
// exports.updatePost = (req, res, next) =>{
//     let post = res.postpost = _.extend(post, req.body)
//     post.updated = Date.now()
//     post.save(err =>{
//         if(err){
//             return res.status(400).json({
//                 error: err
//             });
//         }
//         res.json(post);
//     });
// };
exports.updatePost = (req, res, next) => {
    let form = new formidable.IncomingForm()
    form.keepExtentions = true
    form.parse(req, (err, fields, files)=> {
        if(err) {
            return res.status(400).json({
                error: "Photo could not be uploaded"
            })
        }
        // save post
        let post = req.post
        post = _.extend(post, fields) //using lodash here.
        post.updated = Date.now()

        if(files.photo){
            post.photo.data = fs.readFileSync(files.photo.path);
            post.photo.contentType = files.photo.type;
        }

        post.save((err, result) => {
            if(err){
                return res.status(400).json({
                    error: err
                })
            }
            res.json(post);
        });
    });
};

exports.deletePost = (req,res)=>{
    let post = req.post
    post.remove((err, post)=>{
        if(err){
            return res.status(400).json({
                error:err
            })
        }

        res.json({
            message:"Post deleted Successfully"
        });
    });
};

exports.photo =(req, res) => {
    res.set("Content-Type", req.post.photo.contentType)
    return res.send(req.post.photo.data);
}

exports.singlePost = (req, res) => {
    return res.json(req.post);
}

exports.like = (req, res) => {
    Post.findByIdAndUpdate(req.body.postId,
         {$push: {likes: req.body.userId}},
          {new: true}).exec((err, result)=> {
            if(err) {
                return res.status(400).json({
                    error: err
                })
            } else {
                res.json(result)
            }
          });
};
exports.unlike = (req, res) => {
    Post.findByIdAndUpdate(req.body.postId,
         {$pull: {likes: req.body.userId}},
          {new: true}).exec((err, result)=> {
            if(err) {
                return res.status(400).json({
                    error: err
                });
            } else {
                res.json(result);
            }
          });
};
exports.comment = (req, res) => {
    let comment = req.body.comment
    comment.postedBy = req.body.userId

    Post.findByIdAndUpdate(req.body.postId,
        {$push: {comments: comment}},
         {new: true})
         .populate('comments.postedBy', '_id name')
         .populate("postedBy", "_id, name")
         .exec((err, result)=> {
           if(err) {
               return res.status(400).json({
                   error: err
               })
           } else {
               res.json(result)
           }
         });
        }

        exports.uncomment = (req, res) => {
            let comment = req.body.comment
            comment.postedBy = req.body.userId
        
            Post.findByIdAndUpdate(req.body.postId,
                {$pull: {comments: {_id: comment._id}}},
                 {new: true})
                 .populate('comments.postedBy', '_id name')
                 .populate("postedBy", "_id, name")
                 .exec((err, result)=> {
                   if(err) {
                       return res.status(400).json({
                           error: err
                       })
                   } else {
                       res.json(result)
                   }
                 });
                }


