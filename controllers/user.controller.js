const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userSchema = require('../models/user.model');
const sendResponse = require('../utils/sendResponse');
const generateToken = require('../utils/generateToken');
const sendMail = require('../utils/sendMail');

/**
 * POST
 * @param {username, email, password, id(for google auth), method} req 
 * @param {*} res 
 */
exports.signupUser = async (req, res) => {

    const { username, email, password, id, method } = req.body;
    try {
        let userbymail = await userSchema.findOne({ email: email });
        let userbyname = await userSchema.findOne({ username: username });
        if (userbymail) {
            return sendResponse("User with email already exist!", res, 409);
        } else if (userbyname) {
            return sendResponse("User with this username already exist!", res, 409);
        }
        user = new userSchema({
            username: username,
            email: email,
            active: method.toLowerCase() !== "local",
            method: method.toLowerCase()
        });
        if (method === "local") {
            if (!password) {
                sendResponse('Please provide password', res);
            }
            //encryting password
            const sault = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, sault);
        } else {
            user.googleId = id;
        }

        await user.save();

        const jwtToken = generateToken(user);
        if (method === "local") {
            await userSchema.findByIdAndUpdate(user._id, { mailToken: jwtToken });
            const url =  process.env.CLIENT_HOST +  "/?token=" + jwtToken;
            sendMail(user.email, "Verify your email!", "confirm-email", user.username, url);
            return sendResponse('Email successfully sent', res, 200);
        } else {

            const resObj = {
                token: jwtToken,
                userData: user,
                expiresIn: 86400,
            }
            return sendResponse(resObj, res, 200);

        }
    } catch (error) {
        return sendResponse(error, res, 500);
    }

}
/**
 * 
 * @param {email, password, id(in case of google auth)} req 
 * @param {*} res 
 */
exports.loginUser = async (req, res) => {

    const { username, email, password, method, id } = req.body;
    try {
        let user;
        if(!username) {
            user = await userSchema.findOne({ email });
        }else{
            user = await userSchema.findOne({ username });
        }
        if (!user) {
            return sendResponse('Authentication failed! No such user exist!', res, 404);
        }
        if (!user.active) {
            return sendResponse('Account email is not confirmed yet! Check Your Email Inbox', res, 401);
        }
        const jwtToken = generateToken(user);
        if (method.toLowerCase() === 'local') {
            const ok = await bcrypt.compare(password, user.password);
            if (ok) {
                const resObj = {
                    token: jwtToken,
                    userData: user,
                    expiresIn: 86400,
                }
                return sendResponse(resObj, res, 200);
            } else {
                return sendResponse('Invalid Credentials!', res, 401);
            }
        } else {
            if (id == user.googleId) {
                const resObj = {
                    token: jwtToken,
                    userData: user,
                    expiresIn: 86400,
                }
                return sendResponse(resObj, res, 200);
            } else {
                return sendResponse('Invalid Credentials!', res, 401);
            }
        }
    } catch (err) {
        return sendResponse(err, res, 500);
    }

}

/**
 * 
 * @param {token} req 
 * @param {*} res 
 */
exports.verifyEmail = async (req, res) => {
    const getToken = req.body.token;
    try {
        const ok = jwt.verify(getToken, process.env.SECRETKEY);
        if (ok) {
            let user = await userSchema.findOne({ mailToken: getToken });
            if (user) {
                user.mailToken = '';
                user.active = true;
                await user.save();
                return sendResponse('Account Email Confirmed!', res);
            } else {
                return sendResponse('Account Activation Failed', res, 401);
            }
        } else {
            return sendResponse('Invalid activation requested! Kindly follow url sent in mail!', res, 401);
        }
    } catch (err) {
        return sendResponse(err, res, 500);
    }

}

exports.forgotPassword = async (req, res) => {
    const usermail = req.body.email;
    try {
        let user = await userSchema.findOne({ email: usermail });
        if (!user) {
            return sendResponse("Invalid email, User not found!", res, 404);
        } else {
            const token = generateToken(user);
            user.mailToken = token;
            await user.save();
            const url = "url-goes-here+email_key" + token;
            sendMail(usermail, 'Password help has arrived', 'forgot-password-email', user.username, url);
            return sendResponse("Email sent successfully!", res, 200);
        }
    } catch (err) {
        return sendResponse(err, res, 500);
    }
}


exports.resetPassword = async (req, res) => {
    const { newpass, usrToken } = req.body;
    try {
        const ok = jwt.verify(usrToken, process.env.SECRETKEY);
        if (!ok) {
            return sendResponse("Invalid token or token expired!", res, 401);
        }

        let user = await userSchema.findOne({ mailToken: usrToken });
        if (!user) {
            return sendResponse('Incorrect Token!', res, 400);
        }

        //encryting password
        const sault = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, sault);
        user.mailToken = '';
        await user.save();
        // return sendMail() send mail that password reset!
        return sendResponse("Password updated successfully!", res);

    } catch (err) {
        return sendResponse(err, res, 500);
    }
}


exports.updateUser = async (req, res) => {
    const { username, fullname, bio } = req.body;
    try {
        let user = await userSchema.findOne({ username: username});
        if (!user) {
            return sendResponse("User with this username does not exist!", res, 404);
        }
        user.fullName = fullname;
        user.bio = bio;
        await user.save();
        return sendResponse(user, res);
    } catch (err) {
        return sendResponse(err, res, 500);
    }
}

exports.getUserInfo = async(req, res) => {
    const {username} = req.body;
    try {
        let  user = await userSchema.findOne({username: username});
        if(!user) {
            return sendResponse("User with this username does not exist!", res, 404);
        }
        var data = {
            'fullName':  user.fullName,
            'bio': user.bio,
            'email': user.email
        };
        JSON.parse(JSON.stringify(data));
        return sendResponse(data,res);
    }catch(err) {
        return sendResponse(err,res,500);
    }
}
exports.getAllUsernames = async (req, res) => { 
    let userMap = {};
    let users = await userSchema.find({});

    users.forEach((user) => {
        userMap[user._id] = {
            username: user.username,
            email: user.email
        };
    });

    sendResponse(userMap, res);
}
exports.saveCode = async (req, res) => {

}

exports.deleteCode = async (req, res) => {

}

exports.saveConfig = async (req, res) => {

}
