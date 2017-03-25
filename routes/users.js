//require express, router, User Schema, Restaurant Schema, authHelpers
var express = require('express');
var router = express.Router({mergeParams: true});
var User = require('../models/user.js');
var Restaurant = require('../models/restaurant.js');
var authHelpers = require('../helpers/auth.js');


//======================
// INDEX RESTAURANTS
//======================
router.get('/', function(req, res) {
    // res.send('authors will be here');
    Restaurant.find({})
        .exec(function(err, restaurants) {
            if(err) console.log(err);

            console.log(restaurants);
            res.render('users/index', { restaurants: restaurants});
        });
});

//SIGN UP: create a GET "/signup" that simply renders the signup page
router.get('/signup', function(req, res){
  res.render('users/signup.hbs');
});



//SHOW: shows the page ONLY IF it's the current user's session.
router.get('/:id', authHelpers.authorized, function(req, res, next) {

    User.findById(req.params.id)
      .exec(function(err, user) {
        if (err) { console.log("Oops, You are not authorized!"); }
        res.render("users/show", {
          user: user
        });
    });

    Restaurant.find({})
     .exec(function(err, restaurants) {
         if(err) console.log(err);
         console.log(restaurants);
         res.render('users/show', {
           restaurants: restaurants
         });
     });

});

//User registration
router.post('/', authHelpers.createSecure, function(req, res){
  var user = new User({
    email: req.body.email,
    password_digest: res.hashedPassword,
    firstName: req.body.firstName,
    lastName: req.body.lastName
  });

  user.save(function(err, user){
    if (err) console.log(err);
    console.log(user);
    console.log(req.session.currentUser);
    res.redirect('/sessions/login');
  });
});


module.exports = router;