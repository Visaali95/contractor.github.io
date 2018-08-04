const { PostJob }      = require('../models');
const authService   = require('../services/auth.service');
const { to, ReE, ReS }  = require('../services/util.service')


const create = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
}

module.exports.create = create;
