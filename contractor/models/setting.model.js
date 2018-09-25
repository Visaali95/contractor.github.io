const mongoose = require("mongoose");
var SettingSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true
    },

    image: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);
SettingSchema.statics.findByType = function(type) {
  var UserImage = this;

  return Setting.findOne({ type: type }).then(user => {
    debugger;
    if (!user) {
      return null;
    } else {
      return Promise.resolve(user);
    }
  });
};

var Setting = mongoose.model("Setting", SettingSchema);

module.exports = {
  Setting
};
