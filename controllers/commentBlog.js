const Blog = require("../models/Blog");
const User = require("../models/User");
const mongoose = require("mongoose");


module.exports = async (req, res) => {

    const { comment } = req.body;
    console.log(req.user);


    console.log("Comment post req was made");
    console.log("Req details: ");
    console.log("Comment is:", comment);


    if(comment.length == 0){
        req.flash("message", "Unable to post empty comment.");
        req.flash("success", false);
        return res.redirect("/blog/openBlog/" + req.params.blogId);
    }
    else {
        const newComment = {
            person: req.user._id, // The commenter's user ID
            content: comment      // The comment text
        };
        
        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.blogId,
            { $push: { comments: newComment } },
            { new: true }
        );
        
        console.log("Updated blog:", updatedBlog);
    }
        

    req.flash("message", "<strong>Success!</strong> Comment uploaded successfully.");
    req.flash("success", true);
    return res.redirect("/blog/openBlog/" + req.params.blogId);

}

