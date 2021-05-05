//jshint esversion:6

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
const path = require("path");

// var posts = [];



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false
});

const blogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A must to have a name"]
  },
  body: {
    type: String,
    required: [true, "A must to have a body"]
  }
});

const blogPost = mongoose.model("blog", blogSchema);


app.get("/posts/:postId", function(req, res) {
  const requestedPostId = req.params.postId;

  // requestedTitle = requestedTitle.replace(" ", "-").toLowerCase();
  // console.log(requestedTitle);

  blogPost.findOne({
    _id: requestedPostId
  }, function(err, post) {
    if (!err) {
      res.render("post", {
        Title: post.name,
        Body: post.body
      });
    } else {
      res.render("post", {
        Title: "Error 404!",
        Body: "Page Not found"
      });
    }
  });
});

app.get("/", function(req, res) {

  blogPost.find({}, function(err, foundBlogPosts) {
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully found the items");
    }
    res.render("home", {
      Title: "Home",
      Body: homeStartingContent,
      DemblogPost: foundBlogPosts,
      _: _
    });
  });
});

app.get("/about", function(req, res) {
  res.render("about", {
    Title: "About",
    Body: aboutContent
  });
});

app.get("/contact", function(req, res) {
  res.render("contact", {
    Title: "Contact",
    Body: contactContent
  });
});

app.get("/compose", function(req, res) {
  res.render("compose", {
    Title: "Compose"
  });
});

app.post("/compose", function(req, res) {
  var newPostTitle = req.body.postTitle;
  var newPostBody = req.body.postBody;

  const newBlog = new blogPost({
    name: newPostTitle,
    body: newPostBody,
  });

  newBlog.save(function(err) {
    if (!err) {
      res.redirect("/");
    }
  });

  // var newPost = {
  //   title: newPostTitle,
  //   body: newPostBody
  // };
  // // console.log(newPost);
  // posts.push(newPost);
  // // console.log(posts);
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
