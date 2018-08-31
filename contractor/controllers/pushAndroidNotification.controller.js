var FCM = require("fcm-push");
var serverKey =
  "AAAAtB7Qgrs:APA91bEFa5KXFIvKonN4dQSea92KB_lwD7A_-21ZfszX3tfW3bpu1sGD_R73UOQdwalEXhsXeU6ZKeomLIagaEfK0fSEq_Q_gfg-XXYeL3olYPiJ95q5jRQCD_XPB8m6UyibunuJQ2JE";
var fcm = new FCM(serverKey);
exports.androidPush = (token, notification) => {
  var message = {
    to: token, // required fill with device token or topics
    data: {
      conversationId: notification.conversationId,
      msg: notification.msg,
      time: notification.time,
      receiverId: notification.receiverId,
      senderId: notification.senderId,
      senderName: notification.senderName,
      receiverName: notification.receiverName,
      senderImg: notification.senderImg,
      receiverImg: notification.receiverImg
    },
    notification: {
      title: "Contractor Connect",
      body: notification.message
    }
  };
  console.log(notification);
  fcm
    .send(message)
    .then(response => {
      console.log("Successfully sent with response: ", response);
    })
    .catch(err => {
      console.log("Something has gone wrong!");
      console.error(err);
    });
};
