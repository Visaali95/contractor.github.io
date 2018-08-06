const mongoose 	= require('mongoose');
const RoomDropDownSchema = new mongoose.Schema({
        name:String,
        Interior:Number,
        Exterior:Number,
     });

const roomDropDown = mongoose.model("roomDropDown", RoomDropDownSchema);
module.exports = roomDropDown;
