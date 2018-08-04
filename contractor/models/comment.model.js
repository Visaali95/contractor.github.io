const mongoose 	= require('mongoose');
const User = require("./user.model")
const CommentSchema = new mongoose.Schema({
        user_id:{ type: mongoose.Schema.ObjectId, ref: 'User', require : true},
        rooms:String
     });
const comments = mongoose.model("comments", CommentSchema);
module.exports = comments;
