const mongoose= require('mongoose');
const uuidv1 = require('uuidv1');
const crypto = require('crypto'); // Node js method that is used to hash the passwords.
const {ObjectId} = mongoose.Schema


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true, //if while inserting user has space by mistake, it will be removed.
        required: true
    }, 

    email:{
        type: String,
        trim: true, 
        required: true
    }, 

    //u shud never store plane(as-it is visble)  password in db rather hashed/encrypted.

    hashed_password:{
        type: String,
        required: true
    },

    salt: String,
    created:{
        type:Date,
        default:Date.now //js, u write=> Date.now() but in mangoose, it is Date.now
    },
    
    updated: Date,
    photo: {
        data: Buffer, //will come in binary format
        contentType: String
    },

    about: {
        type: String,
        trim: true
    },

    following: [{type:ObjectId, ref:"User"}],
    followers: [{type:ObjectId, ref:"User"}],

    resetPasswordLink: {
        data: String,
        default: ""
    }

});

//Virtual Field:

userSchema.virtual('password')
.set(function(password){
//creates temperory variable called _password
this._password = password;

//generate a timestamp
 this.salt = uuidv1();

 // Encrypte password.
 this.hashed_password = this.encryptPassword(password)
})
.get(function(){
    return this._password;
});

//methods
userSchema.methods = {
 
    authenticate: function(plainText){ //lec44
        return this.encryptPassword(plainText) == this.hashed_password //will return true if matches.
    },

    encryptPassword: function(password){
        if(!password) return "";

        try{
             return crypto
             .createHmac('sha1', this.salt)  //sha1 is also standard of hashing. u can see the encrypted form online. check it.
             .update(password)
             .digest('hex');
        } catch(err){
            return "";
        }

    }

}


module.exports = mongoose.model("User", userSchema)