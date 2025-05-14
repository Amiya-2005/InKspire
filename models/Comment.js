const mongoose = require("mongoose");

// Comment Sub-Schema with timestamps
const commentSchema = new mongoose.Schema({
    person: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("Comment", commentSchema);