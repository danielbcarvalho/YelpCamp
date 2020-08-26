
const express = require("express"), // web framework for Node.js -> 'app.get()'
    app = express(),
    bodyParser = require("body-parser"), //  body-parser extract the entire body portion of an incoming request stream and exposes it on req. body
    mongoose = require("mongoose"), // Is a tool that helps us interact with MongoDB inside the JS file (node)
    flash = require('connect-flash'), // To show flash messages for users
    passport = require('passport'), // packages to add authentication
    LocalStrategy = require('passport-local'), // local strategy for passport, could be facebook strategy instead...
    methodOverride = require('method-override'), // to 'read' method PUT and DELETE from forms
    Campground = require("./models/campground"), // require model schema campground for db
    Comment = require('./models/comment'), // requeire model comment schema
    User = require('./models/user'), //require model user schema
    seedDB = require('./seeds') // seed automatically the db

//Requiring routes
const commentRoutes = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    indexRoutes = require('./routes/index')

//Connecting to local database yelp_camp with mongoose
mongoose.connect('mongodb://localhost:27017/yelp_camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to DB!'))
    .catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'))
app.use(methodOverride('_method'))
app.use(flash())
//seedDB(); //seed the database

//PASPORT CONFIGURATION
app.use(require('express-session')({
    secret: 'Mel is the best cat in the world',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//passing data inside every ejs file
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
})

//passing automatically the url to the routes
app.use('/', indexRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/comments', commentRoutes)

//server on local port 8080
app.listen(8080, function () {
    console.log("The YelpCamp Server Has Started!");
});