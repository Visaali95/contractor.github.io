const { User }      = require('../models');
const authService   = require('../services/auth.service');
const { to, ReE, ReS }  = require('../services/util.service');

const create = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    const body = req.body;
    if(!body.email && !body.phone && body.fbid && body.twitterid && body.pintrestid && body.instaid){
        return ReE(res, 'Please enter an email or phone number or social media to register.');
    } else if((body.email || body.phone) && !body.password){
        return ReE(res, 'Please enter a password to register.');
    }else if((body.email || body.phone) && !body.postcode){
        return ReE(res, 'Please enter a postcode');
    }else{
        let err, user;
		
        [err, user] = await to(authService.createUser(body));
		
        if(err) return ReE(res, err, 422);
        return ReS(res, {message:'Successfully created new user.', user:user.toWeb(), token:user.getJWT()}, 201);
    }
}
module.exports.create = create;

const get = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let user = req.user;

    return ReS(res, {user:user.toWeb()});
}
module.exports.get = get;

const update = async function(req, res){
    let err, user, data
    user = req.user;
    data = req.body;
    user.set(data);

    User.findById(user._id,function(err, user){
        if(err) return ReE(res, err);
        else if(user){
            if(data.email){
                User.findOne({email:data.email,id:{$ne:user._id}},function(err,user){
                    if(err) return ReE(res, err);
                    if(user) return ReE(res, "email id already exits");
                });
            }else if(data.fbid){
                User.findOne({fbid:data.fbid,id:{$ne:user._id}},function(err,user){
                    if(err) return ReE(res, err);
                    if(user) return ReE(res, "FBid id already exits");
                });
            }else if(data.phone){
                User.findOne({phone:data.phone,id:{$ne:user._id}},function(err,user){
                    if(err) return ReE(res, err);
                    if(user) return ReE(res, "Phone number already exits");
                });
            }else{
                User.findByIdAndUpdate(user._id,{$set:req.body}, function(err, result){
                    if(err){
                         return ReE(res, err);
                    }
                   // console.log("RESULT: " + result);
                     return ReS(res, {message:"Updated Successfully"});
                }); 
            }
            
            

        }else{
            return ReE(res, 'Invalid user token');
        }
        
         

    });
    //console.log(user);
    //err.message = 'Invalid user tokenn';
    //return ReE(res, err);
    //[err, user] = await to(user.save());
        //return ReS(res, {message:user});
    /*[err, user] = await to(user.save());
    if(err){
        console.log(err, user);

        if(err.message.includes('E11000')){
            if(err.message.includes('phone')){
                err = 'This phone number is already in use';
            } else if(err.message.includes('email')){
                err = 'This email address is already in use';
            }else{
                err = 'Duplicate Key Entry';
            }
        }

        return ReE(res, err);
    }
    return ReS(res, {message :'Updated User: '+user.email});*/
}
module.exports.update = update;

const remove = async function(req, res){
    let user, err;
    user = req.user;

    [err, user] = await to(user.destroy());
    if(err) return ReE(res, 'error occured trying to delete user');

    return ReS(res, {message:'Deleted User'}, 204);
}
module.exports.remove = remove;


const login = async function(req, res){
    const body = req.body;
    let err, user;
    //return ReS(res, {token:body});
    
    [err, user] = await to(authService.authUser(req.body));
    if(err) return ReE(res, err, 422);

    return ReS(res, {token:user.getJWT(), user:user.toWeb()});
}
module.exports.login = login;