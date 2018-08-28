const axios = require("axios");
const config = require("../../config/config");
const message = require("../../config/messages").msg;

exports.firebasePush = (token, title, des) => {
  let headers = {
    "Content-Type": "application/json",
    Authorization: config.fcmAuthKey
  };
  token.map((deviceInfo, i) => {
    let body = {
      notification: {
        title: title,
        body: des,
        icon: "assets/images/cmx_logo.png",
        click_action: "/"
      },
      to: deviceInfo.deviceToken,
      priority: "high"
    };
    axios
      .post(config.fcmUrl, body, { headers: headers })
      .then(res => {})
      .catch(e => {});
  });
};
