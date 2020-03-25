const 	express = require("express")
	,	ejs = require("ejs")
	,	bodyParser = require("body-parser")
	,	mongoose = require("mongoose")
	,	Campground = require("./models/campground.js")
	,	seedDb = require("./seedDb.js")
//	,	Comment = require("./models/comment.js")
;

const app = express();

// setup
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
//mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect("mongodb+srv://rest-api-db:Mongmma4819!@cluster0-ttdya.mongodb.net/yelp_camp?retryWrites=true&w=majority", 
	{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
// mongodb+srv://rest-api-db:<password>@cluster0-ttdya.mongodb.net/test?retryWrites=true&w=majority


// seed db
seedDb()

// root route
app.get("/", (req, res) => {
	res.render("landing");
})

// INDEX route - campgrounds get route
app.get("/campgrounds", (req, res) => {
	Campground.find({})
		.catch((err)=>{
			console.log(err);
		})
		.then((campgrounds)=>{
			res.render("index", {campgrounds: campgrounds});
		});
});

// NEW route - campground add new route
app.get("/campgrounds/new", (req, res) => {
	res.render("newCampground.ejs");
});

// CREATE route - campgrounds post route
app.post("/campgrounds", (req, res) => {
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var newCampground = {name: name, image: image, description: description};
	Campground.create(newCampground, (err, campground)=>{
		if (err) {
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	})
});

// SHOW route - show a specific campground 
app.get("/campgrounds/:id", (req, res) => {
	var id = req.params.id;
	Campground.findById(id).populate("comments").exec((err, foundCampground) => {
		if (err) {
			console.log(err);
		} else {
			console.log(foundCampground);
			res.render("show", {campground: foundCampground});
		}
	});
});


// start the server
app.listen(3000, () => {
	console.log("The YelpCamp server started on port 3000");
})
