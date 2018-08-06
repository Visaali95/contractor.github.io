const mongoose 	= require('mongoose');
const Jobs = require('./job.model');
const addRooms = require('./addrooms.model');
const RoomDetailSchema = new mongoose.Schema({
        type_interior: Number,
        type_room:String,
        name:String,
     });
     RoomDetailSchema.virtual('interior', {
            ref: 'Jobs', // The model to use
            localField: 'type_interior', // roomdetails field name
            foreignField: 'isInterior', // user field name
            // If `justOne` is true, 'members' will be a single doc as opposed to
            // an array. `justOne` is false by default.
            justOne: false
          });
    RoomDetailSchema.virtual('rooms', {
                 ref: 'addRooms', // The model to use
                 localField: 'type_room', // roomdetails field name
                 foreignField: 'rooms', // user field name
                 // If `justOne` is true, 'members' will be a single doc as opposed to
                 // an array. `justOne` is false by default.
                 justOne: false
               });

const roomDetail = mongoose.model("roomDetail", RoomDetailSchema);
module.exports = roomDetail;
