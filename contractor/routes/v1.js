const express = require("express");
const router = express.Router();

const profileController = require("../controllers/profile.controller");
const ConversationController = require("../controllers/conversation.controller");
const reviewController = require("../controllers/review.controller");
const assignJobsController = require("../controllers/assignjobs.controller");
const commentsController = require("../controllers/comments.controller");
const bidController = require("../controllers/bid.controller");
const makeOfferController = require("../controllers/makeoffer.controller");
const jobTradeController = require("../controllers/jobtrade.controller");
const validateotpController = require("../controllers/validateotp.controller");
const forgotPasswordController = require("../controllers/forgotpassword.controller");
const jobController = require("../controllers/job.controller");
const UserController = require("../controllers/user.controller");
const CompanyController = require("../controllers/company.controller");
const HomeController = require("../controllers/home.controller");

const custom = require("./../middleware/custom");

const passport = require("passport");
const path = require("path");

require("./../middleware/passport")(passport);
/* GET home page. */

router.get("/", function(req, res, next) {
  res.json({
    status: "success",
    message: "Parcel Pending API",
    data: { version_number: "v1.0.0" }
  });
});

router.post("/users", UserController.create); // C
router.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  UserController.get
); //   // R
router.put(
  "/users",
  passport.authenticate("jwt", { session: false }),
  UserController.update
); // U
router.delete(
  "/users",
  passport.authenticate("jwt", { session: false }),
  UserController.remove
); // D
router.post("/users/login", UserController.login);

router.post(
  "/companies",
  passport.authenticate("jwt", { session: false }),
  CompanyController.create
); // C
router.get(
  "/companies",
  passport.authenticate("jwt", { session: false }),
  CompanyController.getAll
); // R

router.get(
  "/companies/:company_id",
  passport.authenticate("jwt", { session: false }),
  custom.company,
  CompanyController.get
); // R
router.put(
  "/companies/:company_id",
  passport.authenticate("jwt", { session: false }),
  custom.company,
  CompanyController.update
); // U
router.delete(
  "/companies/:company_id",
  passport.authenticate("jwt", { session: false }),
  custom.company,
  CompanyController.remove
); // D

router.get(
  "/draftjob/:user_id",
  passport.authenticate("jwt", { session: false }),
  jobController.draftjob
);

router.get(
  "/jobdetails/:job_id",
  passport.authenticate("jwt", { session: false }),
  jobController.jobDetails
);

router.post("/forgotpassword", forgotPasswordController.create);

router.post("/validateotp", validateotpController.create);

router.get(
  "/dashboard/:user_id",
  passport.authenticate("jwt", { session: false }),
  jobController.DashboardDetails
);

router.post(
  "/jobcreate/:_id",
  passport.authenticate("jwt", { session: false }),
  jobController.create
);

router.post(
  "/lineheight/:_id",
  passport.authenticate("jwt", { session: false }),
  jobController.updatelineheights
);

router.post(
  "/rooms/:_id",
  passport.authenticate("jwt", { session: false }),
  jobController.updaterooms
);

router.put(
  "/edittask/:_id",
  passport.authenticate("jwt", { session: false }),
  jobController.editTask
);

router.get(
  "/search/:user_id",
  passport.authenticate("jwt", { session: false }),
  jobController.searchJobTitle
);
router.get(
  "/searchfilter/:user_id",
  passport.authenticate("jwt", { session: false }),
  jobController.searchFilter
);

router.post("/jobtrade", jobTradeController.create);
router.get("/jobtradeandwork", jobTradeController.fetch);
router.post("/jobwork", jobTradeController.createWork);

router.post(
  "/makeoffer",
  passport.authenticate("jwt", { session: false }),
  makeOfferController.makeOfferCreate
);

router.get(
  "/makeoffer/:jobId",
  passport.authenticate("jwt", { session: false }),
  makeOfferController.makeOfferGet
);

router.post(
  "/bid",
  passport.authenticate("jwt", { session: false }),
  bidController.bidCreate
);

router.post(
  "/comments",
  passport.authenticate("jwt", { session: false }),
  commentsController.commentCreate
);
router.get(
  "/comments/:jobId",
  passport.authenticate("jwt", { session: false }),
  commentsController.commentGet
);

router.post(
  "/assignjobs",
  passport.authenticate("jwt", { session: false }),
  assignJobsController.assignJobsCreate
);

router.post(
  "/review",
  passport.authenticate("jwt", { session: false }),
  reviewController.reviewCreate
);
router.get(
  "/review/:toUserId",
  passport.authenticate("jwt", { session: false }),
  reviewController.reviewGet
);

router.post(
  "/conversations",
  passport.authenticate("jwt", { session: false }),
  ConversationController.ConversationCreate
);
router.get(
  "/conversations/:toUserId",
  passport.authenticate("jwt", { session: false }),
  ConversationController.ConversationGet
);

router.get(
  "/conversations/messages/:conversationId",
  passport.authenticate("jwt", { session: false }),
  ConversationController.MessagesGet
);

router.get(
  "/notifications/:toUserId",
  passport.authenticate("jwt", { session: false }),
  makeOfferController.notificationGet
);

router.post(
  "/profile/:_id",
  passport.authenticate("jwt", { session: false }),
  profileController.profile
);

//********* API DOCUMENTATION **********
router.use(
  "/docs/api.json",
  express.static(path.join(__dirname, "/../public/v1/documentation/api.json"))
);
router.use(
  "/docs",
  express.static(path.join(__dirname, "/../public/v1/documentation/dist"))
);
module.exports = router;
