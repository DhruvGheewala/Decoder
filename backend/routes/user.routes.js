const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
//user controller
router.post('/signup', userController.signupUser);

//user controller
router.post('/verify-email', userController.verifyEmail);

//user controller
router.post('/signin', userController.loginUser);


//user controller
router.post('/forgot-password', userController.forgotPassword);

//user controller
router.post('/reset-password', userController.resetPassword);


//user controller add middleware for auth
router.put('/update-profile', userController.updateUser);

router.post('/save-settings', );

//All related to code-environment

//code controller add middleware for auth
router.post('/save-code', );

//code controller add middleware for auth
router.delete('/delete-code/:id', );



module.exports = router;