const Blog = require("../models/Blog");

module.exports = async (req,res) => {
    const blogId = req.params.blogId;
    const specificBlog = await Blog.findById(blogId)
    .populate({
      path: 'comments',
      populate: {
        path: 'person',
        model: 'User',
        select: 'fullName profilePic'
      }
    })
    .populate('createdBy');

    console.log("Full Blog Data" ,specificBlog);

    const author = specificBlog.createdBy;
    author.password = undefined;

    console.log("author : ",author);

    const user = req.user;

    console.log("user : ",user);
    
    return res.render("openBlog", {
        user,
        specificBlog
    });

}