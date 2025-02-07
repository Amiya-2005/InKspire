const User = require("../models/User");
const bcrypt = require("bcrypt");

const signup =async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        const userExists = await User.findOne({email});

        if(userExists){
            console.log("User has already registered before.");

            req.flash("message", "User has already registered before.");
            req.flash("success", false);
            return res.redirect("/user/login");
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
        });

        console.log("User signed up successfully.", user);

        req.flash("message", "<strong>Success!</strong> User registered successfully.");
        req.flash("success", true);
        return res.redirect("/user/login");

    } 
    catch (err) {
        console.error("User could not be created.", err);

        req.flash("message", "<strong>Server Error...!</strong> Please try again later.");
        req.flash("success", false);
        return res.redirect("/user/signup");
    }
}

module.exports = signup;