const Blog = require("../models/Blog");
const User = require("../models/User");
const mongoose = require("mongoose");


module.exports = async (req,res) => {
    console.log("Call received");

    const profileId = req.params.profileId;  //User Id Of profile owner

    const owner = await User.findById(profileId);
    owner.password = undefined;
    console.log("Opened Profile data : ", owner);

    const blogsArray = await Blog.find({createdBy : owner._id});
    owner.blogsArray = blogsArray;   
    console.log("Blogs in the profile : ", blogsArray);


    const user = req.user;  //current loggedIn user
    console.log("user : ",req.user);




    
    return res.render("profile", {
        owner,
        user,
    });

}