const { Router } = require('express')

const express = require('express'),
    router = express.Router({mergeParams: true}), // changing app.() to router.() -> mergeParans the campground and comments together to access ID  
    Campground = require('../models/campground'),
    Comment = require('../models/comment'),
    middleware = require('../middleware')

// -> app.js defined /campgrounds/:id/comments in every routes

//comments new
router.get("/new", middleware.isLoggedIn,(req, res) => {
    //find campground by id
    Campground.findById(req.params.id)
        .then(campground => res.render("comments/new", { campground: campground }))
        .catch(err => console.log("log...", err))
})

//comments create
router.post('/', middleware.isLoggedIn,async (req, res) => {
    try {
        //lookup campground using ID
        let campground = await Campground.findById(req.params.id)
        //create new comment
        let comment = await Comment.create(req.body.comment)
        //add username and id to comment
        comment.author.id = req.user._id
        comment.author.username = req.user.username
        //save comment
        comment.save()
        //connect new comment to campground
        campground.comments.push(comment) 
        campground.save()
        //redirect campground show page
        res.redirect('/campgrounds/' + campground._id)
    } catch(err) {
        console.log("log...", err);
    }   
})

router.get('/:comment_id/edit', middleware.checkCommentOwnership,(req, res) => {
    Comment.findById(req.params.comment_id)
    .then(foundComment => {
        res.render('comments/edit', {campground_id: req.params.id, comment: foundComment})
    })
    .catch(err => res.redirect('back'))
})

router.put('/:comment_id', middleware.checkCommentOwnership,(req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment)
    .then((foundComment) => res.redirect('/campgrounds/' + req.params.id))
    .catch(err => res.redirect('back'))
})

router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id)
    .then(foundComment => res.redirect('/campgrounds/' + req.params.id))
    .catch(err => res.redirect('back'))
})

module.exports = router
