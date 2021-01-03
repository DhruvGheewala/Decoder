const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userSchema = require('../models/user.model');
const sendResponse = require('../utils/sendResponse');

const User = require('../models/user.model');


exports.signupUser = async (req, res) => {
    
    const {username, email, password, id, method} = req.body;

    try{
        let user = await userSchema.findOne({email: email});
        if(user) {
            sendResponse({error: "User with email already exist!"}, 409);
        }
        user = new userSchema({
            username: username,
            email: email,
            active: method.toLowerCase() !== "local",
        });
        if(method === "local") {
            if(!password) {
                sendResponse();
            }
            const sault = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password,sault);
        }else{
            user.googleId = id;
        }

        await user.save();

        // const token = generateToken();
        if(method === "local") {
            //send mail to confirm
        }
        // send response with JWT or just say that accout successfully created
    }catch(error) {
        
    }
    
}

exports.loginUser = function(req, res) {

}

exports.verifyEmail = function(req, res) {

}

exports.forgotPassword = function(req, res) {

}


exports.resetPassword = function(req, res) {

}


exports.updateUser = function(req, res) {

}

exports.saveCode = function(req,res) {

}

exports.deleteCode = function(req, res) {

}

exports.saveConfig = function(req, res) {

}