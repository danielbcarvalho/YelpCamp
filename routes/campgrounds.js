const express = require('express'),
    router = express.Router(), // changing app.() to router.()
    Campground = require('../models/campground'),
    middleware = require('../middleware') // require index.js with middleware functions

//*** INDEX - show all campgrounds -> app.js defined /campgrounds in every routes
router.get("/", (req, res) => {
    // get all campgrounds from DB send currentUser (req.user)
    Campground.find({})
    .then(allCampgrounds => res.render("campgrounds/index", { campgrounds: allCampgrounds, currentUser: req.user}))
    .catch(err => console.log("log...", err))
})

//*** CREATE - add new campgroud to DB
router.post("/", middleware.isLoggedIn,(req, res) => {
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
router.get("/new", middleware.isLoggedIn,(req, res) => res.render("campgrounds/new"))

///*** SHOW - shows more info about one campground
router.get("/:id", (req, res) => {
    //find the campground with the provide ID
    Campground.findById(req.params.id).populate("comments").exec()
    .then(foundCampground => res.render("campgrounds/show", { campground: foundCampground }))
    .catch(err => console.log("log...", err))
})

//EDIT CAMPGROUND ROUTE
router.get('/:id/edit', middleware.checkCampgroundOwnership,(req, res) => {
        Campground.findById(req.params.id)
        .then((foundCampground) => {
                res.render('campgrounds/edit', {campground: foundCampground})
            })
        .catch((err) => res.redirect('/campgrounds'))  
})

// UPDATE CAMPGROUND ROUTE
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground)
    .then((updatedCampground) => {
        res.redirect('/campgrounds/' + req.params.id)
    })
    .catch(err => res.redirect('/campgrounds'))
    // redirect to show page
})

// DESTROY CAMPGROUND ROUTE
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id)
    .then(() => res.redirect('/campgrounds'))
    .catch(err => res.redirect('/campgrounds'))
})

module.exports = router