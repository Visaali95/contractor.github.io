const mongoose 	= require('mongoose');
const User = require("./user.model")
const AddRoomsSchema = new mongoose.Schema({
        user_id:{ type: mongoose.Schema.ObjectId, ref: 'User', require : true},
        rooms:String
     });
const addRooms = mongoose.model("addRooms", AddRoomsSchema);
module.exports = addRooms;
