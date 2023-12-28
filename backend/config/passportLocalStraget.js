const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../model/userSchema');

// authentication using passport
passport.use(new LocalStrategy({
    usernameField: 'email'
},
async function(email, password, done){
    // find a user and establish the identity
    let user = await User.findOne({email : email});

  console.log("passportuser",user)
    if(!user || user.password != password){
        console.log('Invalid Password');
        return done(null, false);
    }
    return done(null, user);
    
}
));

// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
});



// deserializing the user from the key in the cookies
passport.deserializeUser(async function(id, done){
    
    let userId = await User.findById(id);
    if(!userId){
        console.log("Error in config/ passport-local");
        return ;
    } 
    return done(null, userId);
});
// Checking authentication
passport.checkAuthentication = function (req, res, next){
    console.log("auth",req);
    // if user is signed in , then pass on the request ot the next fucntion (controller's action)
    if(req.isAuthenticated()){
        return next();
    }
    // if the user is not signed in
    return res.status(402).json({"err":"not sign in"});
}
// Setting authentication
passport.setAuthenticatedUser = function(req, res, next){

    if(req.isAuthenticated()){
        
        // currenct user data is stored in the req, so we are just storing its data to res.
        res.locals.user = req.user
        console.log("user",res.user)   
     }

    next();
}

module.exports = passport;