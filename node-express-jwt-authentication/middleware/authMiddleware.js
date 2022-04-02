const jwt = require('jsonwebtoken');
const User = require('../models/users');

const requireAuth =(req ,res ,next) => {
    const token = req.cookies["jwt-cookie"];

    //check json web token exists and is verified
    if(token){
        jwt.verify(token, 'secret-key' , (err, decodedToken ) => {
            if(err){
                console.log(err.message);
                res.redirect('login');
            }else{
                console.log(decodedToken);
                next();
            }
        });
    }
    else{
        res.redirect('/login')
    }
}

const checkUser = (req,res,next) => {
    const token = req.cookies["jwt-cookie"];

    //console.log("Token ", token);

    if(token){
        jwt.verify(token, 'secret-key' , async (err, decodedToken ) => {
            if(err){
                console.log(err);
                res.locals.user = null;
                next();
            }else{
                let user = await User.findById(decodedToken.id)
                console.log("User ", user);
                res.locals.user = user;
                next();
            }
        });
    }
    else{
        res.locals.user = null;
        next();
    }
}

module.exports = { requireAuth , checkUser}