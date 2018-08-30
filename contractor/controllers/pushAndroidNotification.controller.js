var FCM = require("fcm-push");
var serverKey = "";
var fcm = new FCM(serverKey);

var message = {
  to: "", // required fill with device token or topics
  data: {
    your_custom_data_key: "your_custom_data_value"
  },
  notification: {
    title: "Title of your push notification",
    body: "Body of your push notification"
  }
};
// {
//   "message":{
//     "token":"bk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1...",
//     "data":{
//       "Nick" : "Mario",
//       "body" : "great match!",
//       "Room" : "PortugalVSDenmark"
//     }
//   }
// }
fcm
  .send(message)
  .then(function(response) {
    console.log("Successfully sent with response: ", response);
  })
  .catch(function(err) {
    console.log("Something has gone wrong!");
    console.error(err);
  });
