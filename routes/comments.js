const { Router } = require('express')

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

router.get('/:comment_id/edit', checkCommentOwnership,(req, res) => {
    Comment.findById(req.params.comment_id)
    .then(foundComment => {
        res.render('comments/edit', {campground_id: req.params.id, comment: foundComment})
    })
    .catch(err => res.redirect('back'))
})

router.put('/:comment_id', checkCommentOwnership,(req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment)
    .then((foundComment) => res.redirect('/campgrounds/' + req.params.id))
    .catch(err => res.redirect('back'))
})

router.delete('/:comment_id', checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id)
    .then(foundComment => res.redirect('/campgrounds/' + req.params.id))
    .catch(err => res.redirect('back'))
})

//middleware 'secret'
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()) return next()
    res.redirect('/login')
}

function checkCommentOwnership(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id)
        .then((foundComment) => {
            if(foundComment.author.id.equals(req.user._id)){
                next();
            }else res.redirect('back')
        })
        .catch((err) => res.redirect('back'))
    } else res.redirect('back')
}


module.exports = router
