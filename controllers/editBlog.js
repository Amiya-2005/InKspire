const Blog = require("../models/Blog");
const mongoose = require("mongoose");


exports.postReq = async (req,res) => {

    const {title, body} = req.body;
    console.log(req.user);

    const oldBlog = await Blog.findById(req.params.blogId);
    console.log("Old blog : ", oldBlog);

    await Blog.findByIdAndUpdate(req.params.blogId,{title, body});

    
    req.flash("message", "<strong>Success!</strong> Blog has been updated successfully.");
    req.flash("success", true);
    return res.redirect("/blog/openBlog/"+req.params.blogId);

}

exports.getReq = async (req,res) => {
    console.log("Edit getter called.");

    const user = req.user;
    user._id = new mongoose.Types.ObjectId(user._id);     //converting string to objectId to compare using .equals() in frontend
    

    const thisBlog = await Blog.findById(req.params.blogId);
    const authorId = thisBlog.createdBy;

    if( ! authorId.equals(user._id)){

        console.log("Current user : ", user._id);
        console.log("Author user : ", authorId);

        req.flash("message", "<strong>Warning!</strong> You can't edit someone else's blog.");
        req.flash("success", false);
        return res.redirect("/home");
    }

    const specificBlog = await Blog.findById(req.params.blogId);
    console.log("Blog Id is : ", req.params.blogId);

    res.render("editBlog", {
        user : req.user,
        specificBlog
    })
}