const campground = require("./models/campground");
const comment = require("./models/comment");

var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require('./models/comment'),
    seedDB = require('./seeds')

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


app.get("/", (req, res) => res.render("landing"))

//*** INDEX - show all campgrounds
app.get("/campgrounds", (req, res) => {
    // get all campgrounds from DB
    Campground.find({})
    .then(allCampgrounds => res.render("campgrounds/index", { campgrounds: allCampgrounds }))
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
app.get("/campgrounds/:id/comments/new", (req, res) => {
    //find campground by id
    Campground.findById(req.params.id)
        .then(campground => res.render("comments/new", { campground: campground }))
        .catch(err => console.log("log...", err))
})

app.post('/campgrounds/:id/comments', async (req, res) => {
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

app.listen(8080, function () {
    console.log("The YelpCamp Server Has Started!");
});