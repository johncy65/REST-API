const router = require('express').Router()
const User = require('../models/User');
const {registerValidation, loginValidation,validationMessages} =  require("../validation");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


router.post('/register', async (req, res)=>{

    //Validation
    const {error} = registerValidation(req.body);
    if (error) return res.status(400).send({status:'error',message:validationMessages(error), error_type:'validation'});

    //Check if email already exists
    const checkEmail = await User.findOne({email:req.body.email});
    if(checkEmail) return res.status(400).send({status:'error',message:'Email already exists'});

    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    
    //Create User model
    const user = new User({
        firstName:req.body.firstName,
        secondName:req.body.secondName,
        email:req.body.email,
        password:hashedPassword,
    });


    try {
        //Save model
        const savedUser = await user.save();

        //Generate token
        const token = jwt.sign({_id:savedUser._id}, process.env.TOKEN_SECRET, {expiresIn:'1h'});
        res.send({status:'success',data:{name:savedUser.firstName+" "+savedUser.secondName,email:savedUser.email,token:token}});

    } catch (err) {
        res.status(400).send({status:'error', message:err});
    }
});

router.post('/login', async (req, res) =>{

    //Validation
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send({status:'error',message:validationMessages(error)});

    //Check if user is registered
    const user = await User.findOne({email:req.body.email});
    if(!user) return res.status(400).send({status:'error', message:'Email not found'});

    //Validate password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send({status:'error', message:'Invalid password'});

    //Generate token
    const token = jwt.sign({_id:user._id}, process.env.TOKEN_SECRET, {expiresIn:'1h'});
    
    res.send({status:'success',data:{name:user.firstName+" "+user.secondName,email:user.email,token:token}});
});


module.exports = router;