var apn = require("apn"),
  path = require("path");
const CONFIG = require("./config/config");

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
      cert: path.join(__dirname, "pathD"), // insert pem file here
      key: path.join(__dirname, "pathD"), //// insert pem file here
      gateway: "gateway.push.apple.com",
      production: true
    });
    // console.log(service);
    var note = new apn.Notification({
      alert: data.message,
      // click_action:"apn.ACTION.CHAT",
      payload: data
    });

    console.log(note);
    note.topic = "com.app.lopDriver";
    console.log("note-->>", JSON.stringify(note));
    service.send(note, tokens).then(result => {
      console.log(" iosPush sent:", result.sent.length);
      console.log("failed:", result.failed.length);
      console.log(result.failed);
    });

    //note.topic = "<bundle identifier>";
  }
};
