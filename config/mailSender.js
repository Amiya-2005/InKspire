const nodemailer = require("nodemailer");
require("dotenv").config();

let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    secure: true,
    auth: {
        user: process.env.USER_NAME,
        pass: process.env.APP_PASS
    }
});


let mailer = async (to, subject, html) => {
    try {
        const mailedContent = await transporter.sendMail({
            to,
            subject,
            html
        })
        
        return mailedContent;
    }
    catch (err) {
        return;
    }
}

module.exports = mailer;