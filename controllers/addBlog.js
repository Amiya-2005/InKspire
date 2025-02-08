const Blog = require("../models/Blog");
const cloudinary = require("cloudinary").v2;

/**
 * Uploads the file to Cloudinary.
 * This version returns the upload promise so it can be used in a fire-and-forget manner.
 */
async function uploadFileToCloudinary(file, folder, quality) {
  const options = {
    folder,
    resource_type: "auto",
  };
  if (quality) options.quality = quality;

  console.log("Cloudinary options:", options);

  try {
    const up = await cloudinary.uploader.upload(file.tempFilePath, options);
    return up;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
}

/**
 * Main handler for adding a blog.
 * This version saves the blog immediately and then handles image upload asynchronously.
 */
module.exports = async (req, res) => {
  const { title, body } = req.body;
  const user = req.user; // Preserve the original user
  let coverImage;

  if (req.files) {
    coverImage = req.files.coverImage;
  }

  // Create the blog instance without cover image details
  const blog = new Blog({
    title,
    body,
    createdBy: user._id,
  });

  try {
    // Save the blog immediately so that the user gets a fast response.
    await blog.save();
    console.log("Blog saved without cover image:", blog);

    // If a cover image is provided, start the upload asynchronously.
    if (coverImage) {
      // Fire-and-forget upload: do not await its completion.
      uploadFileToCloudinary(coverImage, "Abc_Cloud")
        .then(async (up) => {
          console.log("Cover image uploaded:", up);
          // Update the blog with cover image details.
          blog.coverImageUrl = up.secure_url;
          blog.coverImagePublicId = up.public_id;
          await blog.save(); // Update the record asynchronously.
          console.log("Blog updated with cover image:", blog);
        })
        .catch((uploadError) => {
          console.error("Cover image upload failed:", uploadError);
          // Optionally, log the error and consider notifying the user/admin later.
        });
    }

    // later to do , fire off the mailing process asynchronously.
    // if (typeof sendBlogCreatedEmail === "function") {
    //   sendBlogCreatedEmail(user.email, blog)
    //     .then(() => console.log("Email sent successfully"))
    //     .catch((mailError) => console.error("Email sending failed:", mailError));
    // }

    // Render the response immediately.

    req.flash("message", "<strong>Success!</strong> Blog created successfully");
    req.flash("success", true);
    return res.redirect("/home");

  } catch (error) {
    console.error("Error saving blog:", error);

    req.flash("message", "<strong>Error!</strong> Blog creation failed. Please try again later.");
    req.flash("success", false);
    return res.redirect("/home");
  }
};
