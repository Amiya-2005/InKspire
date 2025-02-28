const Blog = require("../models/Blog");
const User = require("../models/User");
const mongoose = require("mongoose");


module.exports = async (req,res) => {
    const blogId = req.params.blogId;
    const specificBlog = await Blog.findById(blogId);

    console.log("Cov" ,specificBlog.coverImageUrl);

    const authorId = specificBlog.createdBy;
    const author = await User.findById(authorId);
    // specificBlog.authorName = author.fullName;


    console.log("author : ",author);
    author.password = undefined;

    const user = req.user;

    console.log("user : ",user);

    
    return res.render("openBlog", {
        user,
        author,
        specificBlog
    });

}