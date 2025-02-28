const express = require("express");
const app = express();

require("dotenv").config();
require("./config/database").dbConnect();
require("./config/cloudinary").cloudinaryConnect();
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

const flash = require("connect-flash");
const session = require("express-session");

app.use(express.static("public"));
app.use(session({
    secret: "your_secret_key",  // Change this to a secure key
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 } // Optional: Set session expiration
}));
app.use(flash());

// Middleware to make flash messages available in all views
app.use((req, res, next) => {
    res.locals.message = req.flash('message')[0];
    res.locals.success = req.flash('success')[0];

    next();
});

const fileupload = require("express-fileupload");
app.use(fileupload({
    useTempFiles : true,
    tempFileDir : "./tmp/",
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
}));
//this comes before body parser else that takes the whole ip as body and it gets null

const userHandler = require("./router/userHandler");
const blogHandler = require("./router/blogHandler");

const cookieParser = require("cookie-parser");
const checkForAuthenticationCookie = require("./middlewares/Authentication");

const Blog = require("./models/Blog");

const PORT = process.env.PORT || 4000;


app.use(express.static(path.resolve("public")));



app.use(express.urlencoded({extended : true}));
app.use(cookieParser());
//cookieParser is a factory function which gives middleware functions as op so to use middle wares we need to write cookieParser()  i.e called the factory function
app.use(checkForAuthenticationCookie("token"));


app.use("/blog", blogHandler);
app.use("/user", userHandler);
//wrote it at last so that token will have been generated before routing 

app.get("/" , (req,res) =>{
    //return res.render("layout");
    res.redirect("/home");
});
app.get("/home", async (req,res) => {
    const allBlogs = await Blog.find({}); 

    res.render("home", {
        user : req.user,
        allBlogs
    });
});

//for redirect(From cross button of alert)
//if you get any better approach update here
app.post("/home", async (req,res) => {
    // const allBlogs = await Blog.find({}); 

    // res.render("home", {
    //     user : req.user,
    //     allBlogs
    // });
    res.redirect('/home');
})





app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
})