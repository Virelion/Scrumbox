const userSession = require('./userSession');
const db = require('./db');
const helper = require('./helper');
const bcrypt = require("bcryptjs");

var init = function init(app){
    app.post('/api/user/create',(req,res)=>{
        userSession.asAdmin(req,res,(admin)=>{
            
            var data = req.body.data;
            console.log(data);
            var user = new db.User({
                name: data._id,
                hash: bcrypt.hashSync(data.password),
                admin: data.admin,
                team: data.team
            });
            user.save((err)=>{
                if(err){
                    res.send({message:helper.message(err,false)});
                } else {
                    res.send({message:helper.message("Created",true)});
                }
            });
        });
    });

    app.post('/api/user/delete',(req,res)=>{
        userSession.asAdmin(req,res,(admin)=>{
            var data = req.body.data;
            db.User.findById(data._id).remove( (err)=>{
                if(err){
                    res.send({message:helper.message(err,false)});
                } else {
                    res.send({message:helper.message("Removed user",true)});
                }
            });
        });
    });

    app.post('/api/user/list',(req,res)=>{
        userSession.asAdmin(req,res,(admin)=>{
            db.User.find({},'name team admin',(err,users)=>{
                if(err) {
                    res.send({message:helper.message(err,false)});
                } else {
                    res.send({
                        message:helper.message("User list send",true),
                        users: users
                    });
                }
            });
        });
    });
    
    app.post('/api/user/edit',(req,res)=>{
        userSession.asAdmin(req,res,(admin)=>{
            db.User.findById(req.body.data._id,(err,user)=>{
                if(user) {
                    user.admin = req.body.data.admin;
                    if(req.body.data.team==="0" || req.body.data.team===0){
                        user.team = undefined;
                    } else {
                        user.team = req.body.data.team;
                    }
                    user.save((err)=>{
                        if(err){
                            res.send({message:helper.message(err,false)});
                        } else {
                            res.send({message:helper.message("User changed",true)});
                        }
                    });
                }
                else {
                    res.send({message:helper.message("User not found",false)});
                }
            });
        });
    });
};

module.exports = {
    init: init
};