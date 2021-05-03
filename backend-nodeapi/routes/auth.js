// we will have all login signup routes here.

const express= require('express');
const {
    signup,
    signin,
    signout,
    forgotPassword,
    resetPassword,
    
} = require("../controllers/auth");
 
const {userById } = require('../controllers/user');
// delete if not  any error//const user = require('../models/user');
// import password reset validator
const { userSignupValidator, passwordResetValidator } = require("../validator");

//method.
const router =  express.Router() 

router.post("/signup",userSignupValidator, signup);
router.post("/signin",signin);
//signout
router.get("/signout",signout);
router.param("userId", userById);

// password forgot and reset routes
router.put("/forgot-password", forgotPassword);
router.put("/reset-password", passwordResetValidator, resetPassword);

module.exports = router;



 
