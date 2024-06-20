var express = require("express");
var router = express.Router();

const userModel = require("./users");
const postModel = require("./posts");
const passport = require("passport");
const localStrategy = require("passport-local")
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send('hello')
});

router.get("/feed", function (req, res, next) {
  res.render("feed");
});

router.get("/signin", function (req, res, next) {
  res.render("signin");
});

router.get("/login", function (req, res, next) {
  // console.log(req.flash('errror'));
  res.render("login", {error: req.flash('error')});
});

router.get("/profile", isLoggedIn ,function (req, res, next) {
  res.render('profile')
});

router.post('/register', function(req, res){   
  var userData = new userModel({    //userData me password mat dalna bhai! please, vo alag se lagnewala hai
    username : req.body.username,
    email : req.body.email,
    fullname : req.body.fullname,
  })
  userModel.register(userData, req.body.password)
    .then(function(){
      passport.authenticate('local')(req,res, function(){
        res.redirect('/profile');
      })
    })
})

router.post('/login', passport.authenticate('local',{
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true,
}), function(req,res){})

router.get('/logout', function(req,res){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})

function isLoggedIn(req,res,next)
{
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect('/login')
}


// router.get("/createUser", async function (req, res, next) {
//   const newUser = await userModel.create({
//     username: "ram",
//     password: "ramesh",
//     email: "ram@gmail.com",
//     dp: " ",
//     fullname: "ram ji",
//   });
//   res.send(newUser);
// });

// router.get("/createPost",async function (req, res, next) {
//   const newPost = await postModel.create({
//     postText: "hey its 3rd  post!",
//     user: "6673fc2de379b164838126a7",
//     likes: ['6673fe8ad5619235acf9b884','6673fc2de379b164838126a7'],
//   });
//   let user = await userModel.findOne({_id :"6673fc2de379b164838126a7" })
//   user.posts.push(newPost._id)
//   await user.save()
//   res.send(newPost);
// });

// router.get("/allUserPosts",async function (req, res, next) {
  
//   let userposts = await userModel
//     .findOne({_id :"6673fc2de379b164838126a7" })
//     .populate('posts')

//   res.send(userposts);
// });



module.exports = router;