const express = require("express");
const router = express.Router();

const contractEditController = require("../controllers/contractedit.controller");
const testController = require("../controllers/test.controller");
const AdminController = require("../controllers/admin.controller");
const supportFAQController = require("../controllers/supportfaq.controller");
const supportController = require("../controllers/support.controller");
const feedbackController = require("../controllers/feedback.controller");
const aboutUsController = require("../controllers/aboutus.controller");
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
const paymentController = require("../controllers/payment.controller");
const custom = require("./../middleware/custom");
const settingController = require("../controllers/setting.controller");
const passport = require("passport");
const path = require("path");
const keyPublishable = "pk_test_wa7eDXkd2ZhojTyzNHQ1epk7";
const keySecret = "sk_test_AtgHQGrxpvffnRPv5GqoG6Pm";
const stripe = require("stripe")(keySecret);
require("./../middleware/passport")(passport);
/* GET home page. */

router.post("/payment", paymentController.payment);

// setting for contract

router.get(
  "/getAllSetting",
  passport.authenticate("jwt", { session: false }),
  settingController.getAllSetting
);
router.get("/setting", settingController.contract);
router.post("/setting", settingController.addSetting);
router.get("/getimages", settingController.getimages);

router.get("/", function(req, res, next) {
  res.json({
    status: "success",
    message: "Parcel Pending API",
    data: { version_number: "v1.0.0" }
  });
});
// normal users

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
// admin and super admin

router.post("/admin", AdminController.create); // C
router.get(
  "/admin",
  passport.authenticate("jwt", { session: false }),
  AdminController.getAll
); //   // R
router.put(
  "/admin",
  passport.authenticate("jwt", { session: false }),
  AdminController.update
); // U
router.delete(
  "/admin",
  passport.authenticate("jwt", { session: false }),
  AdminController.remove
); // D
router.get(
  "/admin/dashboard",
  passport.authenticate("jwt", { session: false }),
  AdminController.adminDashboard
); //   // R
router.post("/admin/login", AdminController.login);
router.get(
  "/admin/userlist",
  passport.authenticate("jwt", { session: false }),
  AdminController.adminUserList
);
router.get(
  "/admin/joblist",
  passport.authenticate("jwt", { session: false }),
  AdminController.adminJobList
);
router.get(
  "/admin/companylist",
  passport.authenticate("jwt", { session: false }),
  AdminController.adminCompanyList
);
router.get(
  "/admin/contractlist",
  passport.authenticate("jwt", { session: false }),
  AdminController.adminContractList
);
router.put(
  "/admin/jobstatus",
  passport.authenticate("jwt", { session: false }),
  AdminController.adminJobStatus
);
router.put(
  "/admin/userstatus",
  passport.authenticate("jwt", { session: false }),
  AdminController.adminUserStatus
);

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
router.put(
  "/editroom/:_id",
  passport.authenticate("jwt", { session: false }),
  jobController.editRoom
);
router.put(
  "/editlineheight/:_id",
  passport.authenticate("jwt", { session: false }),
  jobController.editLineHeight
);

router.get(
  "/search/:user_id",
  passport.authenticate("jwt", { session: false }),
  jobController.searchJobTitle
);
router.post(
  "/searchfilter/:user_id",
  passport.authenticate("jwt", { session: false }),
  jobController.searchFilter
);
// jobtrade and work crud
router.post("/jobtrade", jobTradeController.create);
router.get("/jobtradeandwork", jobTradeController.fetch);
router.post("/jobwork", jobTradeController.createWork);
router.put("/jobtrade", jobTradeController.updateTrade);
router.delete("/jobtrade", jobTradeController.deleteTrade);
router.put("/jobwork", jobTradeController.updateWork);
router.delete("/jobwork", jobTradeController.deleteWork);

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

router.get(
  "/bid/:jobId",
  passport.authenticate("jwt", { session: false }),
  bidController.bidGet
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
router.get(
  "/conversations/messages",
  passport.authenticate("jwt", { session: false }),
  ConversationController.MessagesGet
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
  "/notifications/:toUserId",
  passport.authenticate("jwt", { session: false }),
  makeOfferController.notificationGet
);

router.post(
  "/profile/:_id",
  passport.authenticate("jwt", { session: false }),
  profileController.profile
);
router.get(
  "/profile/:_id",
  passport.authenticate("jwt", { session: false }),
  profileController.profileGet
);

router.post(
  "/jobcompleted",
  passport.authenticate("jwt", { session: false }),
  jobController.jobCompleted
);

router.post("/aboutus", aboutUsController.aboutUsCreate);

router.post(
  "/feedback",
  passport.authenticate("jwt", { session: false }),
  feedbackController.feedbackCreate
);

router.post(
  "/support",
  passport.authenticate("jwt", { session: false }),
  supportController.create
);

router.post("/supportfaqs", supportFAQController.create);
router.get("/supportfaqs", supportFAQController.fetch);

router.post("/lhpics/:_id", testController.updatelineheights);

// contract edit post
router.post(
  "/contracteditpost",
  passport.authenticate("jwt", { session: false }),
  contractEditController.contractEditPost
);
router.put(
  "/contracteditaccept/:id",
  passport.authenticate("jwt", { session: false }),
  contractEditController.contractEditAccept
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
