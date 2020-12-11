const router = require('express').Router()
const verify = require('../verifyToken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const {updateProfile, updatePassword,validationMessages} =  require("../validation");


router.post('/profile', verify, async(req, res) =>{
    
    const firstName = req.body.firstName;
    const secondName = req.body.secondName;
    const email = req.body.email;

    const checkEmail = await User.findOne({email:email});
    if(checkEmail != null && checkEmail._id != req.user._id) return res.status(400).send({status:'error',message:'Email already exists'});

    try {
       const user = await User.updateOne({_id:req.user._id},{firstName:firstName, secondName:secondName, email:email});
       res.send({status:'success',data:{firstName:firstName,secondName:secondName, email:email}});
    } catch (err) {
        res.status(400).send({status:'error', message:err});
    }
});

router.get('/profile', verify,async (req, res) =>{
    const user = await User.findOne({_id:req.user._id});
    res.send({status:'success', data:{firstName:user.firstName,secondName:user.secondName,email:user.email}});

});

router.post('/password', verify, async(req, res)=>{
    
    const user = await User.findOne({_id:req.user._id});
    
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    const validPassword = await bcrypt.compare(oldPassword, user.password);
    if(!validPassword) return res.status(400).send({status:'error', message:'Invalid password'});

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    

    try {
        let result = await User.updateOne({_id:req.user._id},{password:hashedPassword});
        console.log(result);
        res.send({status:'success'});
    } catch (err) {
        res.status(400).send({status:'error', message:err});
    }


});

module.exports = router;