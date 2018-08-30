var apn = require("apn"),
  path = require("path");
const CONFIG = require("../config/config");

var pathD = "";
if (CONFIG.app === "development") {
  pathD = "../CCdevelopment.pem";
} else {
  pathD = "../CCproduction.pem";
}

module.exports = {
  iosPush: function(tokens, data) {
    console.log("++++============>>>>>>>>>>>>>>>>>>>>>data", tokens, data);
    let service = new apn.Provider({
      cert: path.join(__dirname, pathD), // insert pem file here
      key: path.join(__dirname, pathD), //// insert pem file here
      gateway: "gateway.push.apple.com",
      production: false
    });
    // console.log(service);
    var note = new apn.Notification({
      alert: {
        body: data.message,
        title: "Contractor Connect",
        conversationId: data.conversationId,
        msg: data.msg,
        time: data.time,
        receiverId: data.receiverId,
        senderId: data.senderId,
        senderName: data.senderName,
        receiverName: data.receiverName,
        senderImg: data.senderImg,
        receiverImg: data.receiverImg
      },

      // click_action:"apn.ACTION.CHAT",
      badge: 1,
      "content-available": 1,
      sound: "dong.aiff"
    });

    console.log(note);
    note.topic = "com.parangat.contractorconnectapp";
    console.log("note-->>", JSON.stringify(note));
    service.send(note, tokens).then(result => {
      console.log(" iosPush sent:", result.sent.length);
      console.log("failed:", result.failed.length);
      console.log(result.failed);
    });

    //note.topic = "<bundle identifier>";
  }
};
