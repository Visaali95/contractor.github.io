const { Company } = require("../models");
const { to, ReE, ReS } = require("../services/util.service");
var multer = require("multer");
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb(
    //   null,
    //   "/home/parangat-pt-01/Documents/ParangatTechnologies/contractor_api/public/images/uploads"
    // );
    cb(null, "/home/ubuntu/api/public/images/uploads");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + "." + file.mimetype.split("/")[1]
    );
  },
  fileFilter: function(req, file, cb) {
    var ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
      return cb("Only images are allowed", false);
    }
    cb(null, true);
  }
});
//var upload = multer({storage: storage}).single('image');
//var upload = multer().array('photos',10);
var upload = multer({ storage: storage }).fields([
  { name: "image", maxCount: 1 },
  { name: "photos", maxCount: 8 }
]);
const create = async function(req, res) {
  res.setHeader("Content-Type", "application/json");
  let err, company;

  upload(req, res, function(err) {
    let user = req.user;
    var company_info = req.body;
    company_info.user = user._id;
    console.log(req.body);
    console.log(req.files);
    if (err) {
      return ReE(res, err, 422);
    }
    if (req.files) {
      var logo = [];
      var logos = req.files.image;
      if (Array.isArray(logos)) {
        for (var val of logos) {
          logo.push("http://18.222.231.171:8081/" + val.filename);
        }
        company_info.logo = logo;
      } else {
        company_info.logo = req.files.logos[0].filename;
      }
      var pictures = [];
      var photos = req.files.photos;
      if (Array.isArray(photos)) {
        for (var val of photos) {
          pictures.push("http://18.222.231.171:8081/" + val.filename);
        }
        company_info.pictures = pictures;
      } else {
        company_info.pictures = req.files.photos[0].filename;
      }

      //console.log(company_info);
      Company.create(company_info, function(err, company) {
        if (err) return ReE(res, err, 422);
        return ReS(res, { company: company.toWeb() }, 201);
      });
    } else {
      Company.create(company_info, function(err, company) {
        if (err) return ReE(res, err, 422);
        return ReS(res, { company: company.toWeb() }, 201);
      });
    }
  });
};
module.exports.create = create;
const getAll = async function(req, res) {
  res.setHeader("Content-Type", "application/json");
  let user = req.user;
  let err, companies;
  [err, companies] = await to(user.Companies());
  let companies_json = [];
  for (let i in companies) {
    let company = companies[i];
    companies_json.push(company.toWeb());
  }

  return ReS(res, { companies: companies_json });
};
module.exports.getAll = getAll;
const get = function(req, res) {
  res.setHeader("Content-Type", "application/json");
  let company = req.company;

  return ReS(res, { company: company.toWeb() });
};
module.exports.get = get;
const update = async function(req, res) {
  let err, company, data;
  company = req.user;
  data = req.body;
  company.set(data);
  [err, company] = await to(company.save());
  if (err) {
    return ReE(res, err);
  }
  return ReS(res, { company: company.toWeb() });
};
module.exports.update = update;
const remove = async function(req, res) {
  let company, err;
  company = req.company;
  [err, company] = await to(company.remove());
  if (err) return ReE(res, "error occured trying to delete the company");
  return ReS(res, { message: "Deleted Company" }, 204);
};
module.exports.remove = remove;
