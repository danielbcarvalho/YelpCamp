const passport = require('passport'),
    express = require('express'),
    router = express.Router(), // changing app.() to router.()
    User = require('../models/user')

//root route
router.get("/", (req, res) => res.render("landing"))

//show register form
router.get('/register', (req, res) => {
    res.render('register')
})

//handle sign up logic
router.post('/register', (req, res) => {
    const newUser = new User({username: req.body.username})
    //passport-local-mongoose
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            console.log("log...", err)
            return res.render('register')
        } 
        passport.authenticate('local')(req, res, () =>{
            res.redirect('/campgrounds')
        })

    })
})

//show login form
router.get('/login', (req, res) => res.render('login'))

//handling login logic
// app.post('/login', middleware, callback)
router.post('/login', passport.authenticate('local', 
    {
        successRedirect: '/campgrounds', 
        failureRedirect: '/login'
    }), (req, res) => {  
})

// logic logout route
router.get('/logout', (req, res) => {
    req.logOut()
    res.redirect('/campgrounds')
})

//middleware 'secret'
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()) return next()
    res.redirect('/login')
}

module.exports = router
