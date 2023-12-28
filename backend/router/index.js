const  express = require("express");
const router=express.Router();
const user=require('../model/userSchema')
const passport=require("passport")
const multer=require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now()
      cb(null,  uniqueSuffix+file.originalname)
    }
  })
  
  const upload = multer({ storage: storage }).array('image', 2);
router.get('/',(req,res)=>{
    res.end("hi")
})

router.post('/signup', async (req, res) => {
    upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        // Multer related error
        return res.status(500).json({ error: err.message });
      } else if (err) {
        // Other errors
        return res.status(500).json({ error: err.message });
      }
  
      try {
        
        const imagePaths = req.files.map((file) =>file.filename);
       const User= await user.create({name:req.body.name, username:req.body.username,email:req.body.email, password:req.body.password,backimage:imagePaths[0], image:imagePaths[1]})
         
        // Save image paths to MongoDB using Mongoose or any ODM/ORM
        // const savedImages = await Image.create({ paths: imagePaths });
  
        return res.status(200).json({ User: User });
      } catch (error) {
        return res.status(500).json({ error: 'Error saving images to MongoDB' });
      }
    });
  });



  router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin' }),async(req,res)=>{
    try{
      
     
     return res.status(200).json({"mess":"success","userinfo":req.user,"sessionid":`${req.session.id}`})
  }catch(err){
      console.log(err)
  }
  })
  router.get('/getUser/:id',async(req,res)=>{
    try{
          let User=await user.findById(req.params.id);
          if(User){
            return res.status(200).json({"user":User})
          }
          else{
            return res.status(500).json({ error: 'no user found' });
            
          }
    }catch(err){
      console.log(err)

    }
      

  })




module.exports=router;

