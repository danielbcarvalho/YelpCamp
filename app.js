var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

var campgrounds = [
    {name: "Salmon Creek", image: "https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"},
    {name: "Granite Hill", image: "https://www.saltao.com.br/wp-content/uploads/2015/01/camping-saltao-2.jpg"},
    {name: "Camping do Paiol", image: "https://ondeacampar.com.br/wp-content/uploads/Camping-do-Paiol-5.jpg"}
]

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){

    res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", function(req, res){
    //get data from form and add to backgorunds array
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
    campgrounds.push(newCampground);
    //redirect back to campgrounds
    res.redirect("/campgrounds");

});

app.get("/campgrounds/new", function(req, res){
    res.render("new");
});

app.listen(8080, function(){
    console.log("The YelpCamp Server Has Started!");
});