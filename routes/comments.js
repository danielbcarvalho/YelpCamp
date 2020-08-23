const express = require('express'),
    router = express.Router({mergeParams: true}), // changing app.() to router.() -> mergeParans the campground and comments together to access ID  
    Campground = require('../models/campground'),
    Comment = require('../models/comment')

// -> app.js defined /campgrounds/:id/comments in every routes

//comments new
router.get("/new", isLoggedIn,(req, res) => {
    //find campground by id
    Campground.findById(req.params.id)
        .then(campground => res.render("comments/new", { campground: campground }))
        .catch(err => console.log("log...", err))
})

//comments create
router.post('/', isLoggedIn,async (req, res) => {
    try {
        //lookup campground using ID
        let campground = await Campground.findById(req.params.id)
        //create new comment
        let comment = await Comment.create(req.body.comment)
        //connect new comment to campground
        campground.comments.push(comment) 
        campground.save()
        //redirect campground show page
        res.redirect('/campgrounds/' + campground._id)
    } catch(err) {
        console.log("log...", err);
    }   
})

//middleware 'secret'
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()) return next()
    res.redirect('/login')
}

module.exports = router
