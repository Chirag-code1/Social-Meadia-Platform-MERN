const mongoose= require('mongoose');
const {ObjectId} = mongoose.Schema
const postSchema = new mongoose.Schema({
    title:{
        type:String,
      //  required: "Title is required",
        required: true
        //Following validations are now handles by express-validation
        // minlength: 4,
        // maxlength: 150

    }, 

    body:{
        type:String,
       // required: "Body is required",
        required: true
    //     minlength: 4,
    //     maxlength: 2000
     },

    photo:{
            data:Buffer,
         //when u upload img, they r big in size, from FE->be->in req->take time to recieve img by that time is available in buffer.
        //Node js allocate some space to give a bit of space.
        contentType:String
    },

    postedBy:{
        type: ObjectId,
        ref: "User"
    },

    created:{
        type:Date,
        default:Date.now
    },

    updated: Date,
    likes: [{type:ObjectId, ref:"User"}],
    comments: [
        {
            text: String,
            created: {type: Date, default: Date.now},
            postedBy: {type: ObjectId, ref:"User"}
        }
    ]
    



});

module.exports = mongoose.model("Post", postSchema)