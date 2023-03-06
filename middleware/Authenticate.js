const jwt = require('jsonwebtoken');
const User = require ("../models/userSchema")


const Authenticate = async (req,res,next)=>{
try{
    let token = req.cookies.jwtoken;
        // console.log(token)
    const verfiyToken = jwt.verify(token,process.env.SECRET_KEY);
    
    const rootUser = await User.findOne({_id:verfiyToken._id,"tokens.token":token});
    
    if(!rootUser){throw new Error('User not found')}
    
    // console.log(rootUser+"here");
    req.token= token;
    req.rootUser=rootUser;
    req.userID=rootUser._id;


    next();

}catch(err){
    // console.log(token)

    res.status(402).send('Unauthorized');
    console.log(err);
}
}

module.exports= Authenticate;