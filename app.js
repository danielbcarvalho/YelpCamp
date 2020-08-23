const campground = require("./models/campground");
const comment = require("./models/comment");

const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    Campground = require("./models/campground"),
    Comment = require('./models/comment'),
    User = require('./models/user'),
    seedDB = require('./seeds')

const commentRoutes = require('./routes/comments')

mongoose.connect('mongodb://localhost:27017/yelp_camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to DB!'))
    .catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'))
seedDB();

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

//passing req.user inside every route
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})

app.get("/", (req, res) => res.render("landing"))

//*** INDEX - show all campgrounds
app.get("/campgrounds", (req, res) => {
    // get all campgrounds from DB send currentUser (req.user)
    Campground.find({})
    .then(allCampgrounds => res.render("campgrounds/index", { campgrounds: allCampgrounds, currentUser: req.user}))
    .catch(err => console.log("log...", err))
})

//*** CREATE - add new campgroud to DB
app.post("/campgrounds", (req, res) => {
    //get data from form and add to backgorunds array
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description;
    let newCampground = { name: name, image: image, description: desc };
    //create a new campground and save to DB
    Campground.create(newCampground)
    .then(newlyCreated => res.redirect("/campgrounds"))
    .catch(err => console.log("log...", err))
})

//*** NEW - show form to create new campground
app.get("/campgrounds/new", (req, res) => res.render("campgrounds/new"))

///*** SHOW - shows more info about one campground
app.get("/campgrounds/:id", (req, res) => {
    //find the campground with the provide ID
    Campground.findById(req.params.id).populate("comments").exec()
    .then(foundCampground => res.render("campgrounds/show", { campground: foundCampground }))
    .catch(err => console.log("log...", err))
})

//========================
// COMMENTS ROUTES
app.get("/campgrounds/:id/comments/new", isLoggedIn,(req, res) => {
    //find campground by id
    Campground.findById(req.params.id)
        .then(campground => res.render("comments/new", { campground: campground }))
        .catch(err => console.log("log...", err))
})

app.post('/campgrounds/:id/comments', isLoggedIn,async (req, res) => {
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

//========================
// AUTH ROUTES
//========================
//show regiuster form
app.get('/register', (req, res) => {
    res.render('register')
})

//handle sign up logic
app.post('/register', (req, res) => {
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
app.get('/login', (req, res) => res.render('login'))

//handling login logic
// app.post('/login', middleware, callback)
app.post('/login', passport.authenticate('local', 
    {
        successRedirect: '/campgrounds', 
        failureRedirect: '/login'
    }), (req, res) => {  
})

// logic logout route
app.get('/logout', (req, res) => {
    req.logOut()
    res.redirect('/campgrounds')
})

//middleware 'secret'
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()) return next()
    res.redirect('/login')
}

app.listen(8080, function () {
    console.log("The YelpCamp Server Has Started!");
});