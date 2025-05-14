const Blog = require("../models/Blog");
const Comment = require("../models/Comment");

exports.postComment = async (req, res) => {
    try {
        const { comment } = req.body;
        console.log(req.user);


        console.log("Comment post req was made");
        console.log("Req details: ");
        console.log("Comment is:", comment);


        if (comment.length == 0) {
            req.flash("message", "Unable to post empty comment.");
            req.flash("success", false);
            return res.redirect("/blog/openBlog/" + req.params.blogId);
        }
        else {
            const newComment = await Comment.create({
                person: req.user._id, // The commenter's user ID
                content: comment      // The comment text
            });

            const updatedBlog = await Blog.findByIdAndUpdate(
                req.params.blogId,
                { $push: { comments: newComment } },
                { new: true }
            );

            console.log("Updated blog:", updatedBlog);
        }


        req.flash("message", "<strong>Success!</strong> Comment uploaded successfully.");
        req.flash("success", true);

        return res.redirect('back');
    }
    catch (err) {
        console.log("Error encountered while posting comment : ", err);
        req.flash("message", "Server error");
        req.flash("success", false);
        return res.redirect('back');
    }
}

exports.deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { user } = req;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            req.flash("message", "<strong>Error!</strong> Comment does not exist.");
            req.flash("success", false);

            return res.redirect(`/blog/openBlog/${req.params.blogId}`);
        }
        if (comment.person._id.toString() !== user._id) {
            req.flash("message", "<strong>Warning!</strong> You can't delete someone else's comment.");
            req.flash("success", false);

            return res.redirect('back');
        }

        await Comment.findByIdAndDelete(commentId);

        req.flash("message", "<strong>Success!</strong> Comment deleted successfully.");
        req.flash("success", true);

        return res.redirect('back');

    }
    catch (err) {
        console.log("Error encountered while deleting comment : ", err);
        req.flash("message", "Server error");
        req.flash("success", false);

        return res.redirect('back');
    }
}

