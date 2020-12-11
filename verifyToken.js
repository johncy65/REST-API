const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const token = req.header('Authorization');
    if(!token) return res.send(401).send({status:'error',message:'Token is missing'});

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.send({status:'error',message:'Invalid token'});
    }    
}