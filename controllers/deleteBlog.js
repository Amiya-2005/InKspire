const mongoose = require("mongoose");
const Blog = require("../models/Blog");
const cloudinary = require("cloudinary");

module.exports = async (req, res) => {
    console.log("Delete request received.");

    const user = req.user;
    user._id = new mongoose.Types.ObjectId(user._id); // Convert to ObjectId

    const thisBlog = await Blog.findById(req.params.blogId);
    if (!thisBlog) {
        req.flash("message", "Blog not found.");
        req.flash("success", false);
        return res.redirect("/home");
    }

    if (!thisBlog.createdBy.equals(user._id)) {
        req.flash("message", "You cannot delete someone else's blog.");
        req.flash("success", false);

        return res.redirect("/home");
    }

    // Delete Blog
    await Blog.findByIdAndDelete(req.params.blogId);

    // Delete Cover Image from Cloudinary (if exists)
    if (thisBlog.coverImagePublicId) {
        try {
            await cloudinary.uploader.destroy(thisBlog.coverImagePublicId);
            console.log("Image removed from Cloudinary.");
        } catch (error) {
            console.log("Failed to remove image from Cloudinary.");
        }
    }

    req.flash("message", "<strong>Success!</strong> Blog deleted successfully.");
    req.flash("success", true);

    return res.redirect("/home");
};
