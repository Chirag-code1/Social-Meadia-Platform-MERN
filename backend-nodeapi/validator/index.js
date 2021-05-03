exports.createPostValidator = (req, res, next) => {

    //title validation using express-validator
    req.check('title', "Write a title").notEmpty()
    req.check('title', "Title must be between 4-150 characters").isLength({
        min:4,
        max:150
    });



    //body validation using express-validator
    req.check('body', "Write a body").notEmpty()
    req.check('body', "Body must be between 4-2000 characters").isLength({
        min:4,
        max:2000
    });


   //check  for other errors: 
   const errors = req.validationErrors();

   //if error show the first one as they happen.

   if(errors){
       const firstError = errors.map((error)=>error.msg)[0]; //this will map through all the errors and from array of error, it will return the error at index[0]
       return res.status(400).json({error: firstError}); // returning status 400=>means error. and also giving the response in json format to make it user-friendly.
   }

   //proceed to next middleware by using next();
   next();
};



exports.userSignupValidator = (req, res, next)=>{

    //name is not null and between 4-10 characters.
    req.check("name", "Name is required").notEmpty();

    //email is not null, valid and normalized
    req.check("email", "Email must be between 3 to 32 characters")
    .matches(/.+\@.+\..+/)
    .withMessage("Email must contain @")
    .isLength({
        min: 4,
        max:200
    })



    //check for password:
    req.check("password","Password is required").notEmpty();
    req.check("password")
    .isLength({min:6})
    .withMessage("Password must contain atleast 6 characters")
    .matches(/\d/)
    .withMessage("Password must contain a number")

    //check for errors:

    const errors = req.validationErrors();
   if(errors){
       const firstError = errors.map((error)=>error.msg)[0]; //this will map through all the errors and from array of error, it will return the error at index[0]
       return res.status(400).json({error: firstError}); // returning status 400=>means error. and also giving the response in json format to make it user-friendly.
   }
   next();
}

exports.passwordResetValidator = (req, res, next) => {
    // check for password
    req.check("newPassword", "Password is required").notEmpty();
    req.check("newPassword")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 chars long")
        .matches(/\d/)
        .withMessage("must contain a number")
        .withMessage("Password must contain a number");
 
    // check for errors
    const errors = req.validationErrors();
    // if error show the first one as they happen
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    // proceed to next middleware or ...
    next();
};