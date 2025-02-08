const Blog = require("../models/Blog");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary");


const { uploadFileToCloudinary } = require("../config/cloudinary");


exports.postReq = async (req, res) => {

    const { title, body } = req.body;
    console.log(req.user);

    let coverImage;


    if (req.files) {
        coverImage = req.files.coverImage;
    }

    const oldBlog = await Blog.findById(req.params.blogId);
    console.log("Old blog : ", oldBlog);

    const prevImgurl = oldBlog.coverImageUrl;
    const prevImgId = oldBlog.coverImagePublicId;


    console.log("Edit post req was made");
    console.log("Req details: ");
    console.log(coverImage, title,body);
    if (coverImage) {
        uploadFileToCloudinary(coverImage, "Abc_Cloud")
            .then(async (up) => {
                console.log("New cover image uploaded successfully:", up);
                // Update the blog with cover image details.
                oldBlog.coverImageUrl = up.secure_url;
                oldBlog.coverImagePublicId = up.public_id;
                oldBlog.save();

                try {
                    await cloudinary.uploader.destroy(prevImgId);
                    console.log("Old image removed from Cloudinary.");
                } catch (error) {
                    console.log("Failed to remove old image from Cloudinary.");
                }

                console.log("Blog updated with cover image:", oldBlog);
            })
            .catch((uploadError) => {
                oldBlog.coverImageUrl = prevImgurl;
                oldBlog.coverImagePublicId = prevImgId;
                oldBlog.save();
                console.error("Cover image update failed:", uploadError);
            });

            console.log("New blog:", oldBlog);

    }

    else {
        const newBlog = await Blog.findByIdAndUpdate(req.params.blogId, { title, body }, { new: true }); 
        console.log("New blog:", newBlog);
    }



    req.flash("message", "<strong>Success!</strong> Blog has been updated successfully.");
    req.flash("success", true);
    return res.redirect("/blog/openBlog/" + req.params.blogId);

}

exports.getReq = async (req, res) => {
    console.log("Edit getter called.");

    const user = req.user;
    user._id = new mongoose.Types.ObjectId(user._id);     //converting string to objectId to compare using .equals() in frontend


    const thisBlog = await Blog.findById(req.params.blogId);
    const authorId = thisBlog.createdBy;

    if (!authorId.equals(user._id)) {

        console.log("Current user : ", user._id);
        console.log("Author user : ", authorId);

        req.flash("message", "<strong>Warning!</strong> You can't edit someone else's blog.");
        req.flash("success", false);
        return res.redirect("/home");
    }

    const specificBlog = await Blog.findById(req.params.blogId);
    console.log("Blog Id is : ", req.params.blogId);

    res.render("editBlog", {
        user: req.user,
        specificBlog
    })
}