const Campground = require('../models/campground'),
    Comment = require('../models/comment')

const middlewareObj = {}

// Check Campground Ownership
middlewareObj.checkCampgroundOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id)
            .then((foundCampground) => {
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', 'You don´t have permission')
                    res.redirect('back')
                }    
            })
            .catch((err) => {
                req.flash('error', 'Campground not found')
                res.redirect('back')
            })
    } else res.redirect('back')
}

// Check Campground Comments Ownership
middlewareObj.checkCommentOwnership = function (req, res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id)
            .then((foundComment) => {
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else{
                    req.flash('error', 'You dont have permission')
                    res.redirect('back')
                } 
            })
            .catch((err) => res.redirect('back'))
    } else{
        req.flash('error', 'You need to be log in to do that')
        res.redirect('back')
    }
}
//middleware 'secret'
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()) return next()
    req.flash('error', 'You need to be logged in to do that')
    res.redirect('/login')
}

module.exports = middlewareObj