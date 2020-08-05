const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/cat_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

var catSchema = new mongoose.Schema({
   name: String,
   age: Number,
   temperament: String
});

var Cat = mongoose.model("Cat", catSchema);

//adding a new cat to the DB
/*
var george = new Cat({
    name: "Nina",
    age: 3,
    temperament: "Instable"
});

george.save(function(err, cat){
    if(err){
        console.log("Something went wrong...")
    } else {
        console.log("Cats saved");
        console.log(cat);
    }
});
*/
Cat.create({
    name: "Snow White",
    age: 15,
    temperament: "Bland"
}, function(err, cat){
    if(err){
        console.log(err);
    } else {
        console.log(cat);
    }
});

//retrieve all cats from the DB and console.log each one

Cat.find({}, function(err, cats){
    if(err){
        console.log("errorrrr");
        console.log(err);
    } else {
        console.log("cats retrived");
        console.log(cats);
    }
})