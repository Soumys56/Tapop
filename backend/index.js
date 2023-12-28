const express=require('express');
const port=8001;
var cors = require('cors')
const app=express();

app.use(cors())
// Creating session
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passportLocalStraget');
const db=require('./config/mongoose');
app.use(express.urlencoded());
app.use(express.json());
// requiring mongo-store, so that we can use the existing user even after server start
const MongoStore = require('connect-mongo');

// mongo store is used to store the session cookie in the db 
app.use(session({
    name: "tapop",
    // change secret during before deployment in production 
    secret: "Intern",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: MongoStore.create({
        mongoUrl: 'mongodb://127.0.0.1/tapop',
        autoRemove: 'disabled'
    },
        (err) => {
            console.log(err || 'connect-mongo setup ok');
        }
    )
  }))
  
  
  app.use(passport.initialize());
  
  app.use(passport.session());

app.use(express.static('public'))


app.use('/',require('./router/index'));

app.listen(port,(err)=>{
    if(port){
       
        console.log("server running on port",port);
        return;
    }
    console.log("server is not running",err);



})





