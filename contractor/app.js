const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const passport = require("passport");
const pe = require("parse-error");
const cors = require("cors");
const path = require("path");
const v1 = require("./routes/v1");

// const job = require('./routes/job');

const app = express();

const CONFIG = require("./config/config");
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

//Passport
app.use(passport.initialize());
//Log Env
console.log("Environment:", CONFIG.app);
//DATABASE
const models = require("./models");

// CORS
app.use(cors());
// Require static assets from public folder

app.use(express.static(path.join(__dirname, "public/images/uploads")));
// Set 'views' directory for any views
// being rendered res.render()
app.set("views", path.join(__dirname, "views"));

app.engine("ejs", require("ejs").renderFile);
app.set("view engine", "ejs");
// Set view engine as EJS
// app.engine("html", require("jade").renderFile);
// app.set("view engine", "html");

// set limit of request uploading
app.use(bodyParser.json({ limit: "1073741824" }));
app.use(bodyParser.urlencoded({ limit: "1073741824", extended: true }));

app.use("/api", v1);
// app.use('/api', job);
app.get("/pay", function(req, res) {
  res.render("payment");
});
app.use("/", function(req, res) {
  res.statusCode = 400; //send the appropriate status code
  res.json({
    status: null,
    message: "API does not exist. Please check the URL",
    data: {}
  });
});

//catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  console.log(err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: "err" });
});

module.exports = app;

process.on("unhandledRejection", error => {
  console.error("Uncaught Error", pe(error));
});
