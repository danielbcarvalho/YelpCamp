const express = require('express'),
    router = express.Router(), // changing app.() to router.()
    Campground = require('../models/campground')
    
//*** INDEX - show all campgrounds -> app.js defined /campgrounds in every routes
router.get("/", (req, res) => {
    // get all campgrounds from DB send currentUser (req.user)
    Campground.find({})
    .then(allCampgrounds => res.render("campgrounds/index", { campgrounds: allCampgrounds, currentUser: req.user}))
    .catch(err => console.log("log...", err))
})

//*** CREATE - add new campgroud to DB
router.post("/", isLoggedIn,(req, res) => {
    //get data from form and add to backgorunds array
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    let newCampground = { name: name, image: image, description: desc, author: author };
    //create a new campground and save to DB
    Campground.create(newCampground)
    .then(newlyCreated => res.redirect("/campgrounds"))
    .catch(err => console.log("log...", err))
})

//*** NEW - show form to create new campground
router.get("/new", isLoggedIn,(req, res) => res.render("campgrounds/new"))

///*** SHOW - shows more info about one campground
router.get("/:id", (req, res) => {
    //find the campground with the provide ID
    Campground.findById(req.params.id).populate("comments").exec()
    .then(foundCampground => res.render("campgrounds/show", { campground: foundCampground }))
    .catch(err => console.log("log...", err))
})

//middleware 'secret'
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()) return next()
    res.redirect('/login')
}

module.exports = router