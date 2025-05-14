const mongoose = require("mongoose");
const transporter = require("../config/mailSender");

const blogSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    body : {
        type : String,
        required : true,
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "User",
    },
    coverImageUrl : {
        type : String,
        default : "/images/abc.png"
    },
    coverImagePublicId : {
        type : String,
    },
    likes : {
        type :  [{
             person : {
                 type :  mongoose.Schema.Types.ObjectId,
                 ref : "User",
                 required : true
             },
             likeOrDislike : {
                type : Number,     
                enum : [-1,1],      // -1 or 1
                required : true,
            }
         }],
         default : []
    },
    comments : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Comment", 
    }],
}, { timestamps: true });


blogSchema.post("save", async (doc) =>{
    try{

        await doc.populate("createdBy");

        console.log("DOC", doc);

        let mailSent = await transporter.sendMail({
            to: doc.createdBy.email,
            subject: "Img has arrived.",
            html: `<h2>Hello !</h2><p>Cover Image uploaded successfully on cloudinary<br /><a href = ${doc.coverImageUrl} >View here</a></p>`
        })
       
        console.log("Mail-sent : ",mailSent);
    }

    catch(error){
        console.log("Error occured while sending mail.");
        console.log(error.message);
        console.log(error);
    }
}
)


module.exports = mongoose.model("Blog", blogSchema);