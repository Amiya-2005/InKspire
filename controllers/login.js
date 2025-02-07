const {createToken} = require("../utils/auth");
const User = require("../models/User");
const bcrypt = require("bcrypt");


const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({email});

        if(!user){
            console.log("Please sign up first.");

            req.flash("message", "<strong>Error </strong> Please signup first.");
            req.flash("success", false);
            return res.redirect("/signup");
        }

        const hashedPassword = user.password;
        if( ! await bcrypt.compare(password, hashedPassword)){

            console.log("Incorrect password.");

            req.flash("message", "<strong>Error </strong> Incorrect password.");
            req.flash("success", false);
            return res.redirect("/login");
        }  

        user.password = undefined;
        const token = createToken(user);

        console.log("User loggedIn successfully:", {
            user,
            message : "<strong>Success!</strong> Login successful."
        });
        console.log("JWT token :", token);
        res.cookie("token", token);

        req.flash("message", "<strong>Success!</strong> Login successful.");
        req.flash("success", true);
        return res.redirect("/home");

    } 
    catch (err) {
        console.log("User could not be loggedIn. Please try again later.");
        console.error(err);

        req.flash("message", "<strong>Server Error...</strong> Please try again later.");
        req.flash("success", failed);
        return res.redirect("/login");
    }
}

module.exports = login;