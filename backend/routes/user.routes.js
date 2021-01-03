const express = require('express');
const router = express.Router();

//user controller
router.post('/signup', );

//user controller
router.post('/verify-email', );

//user controller
router.post('/login', );


//user controller
router.post('/forgot-password', );

//user controller
router.post('/reset-password', );


//user controller add middleware for auth
router.put('/update-profile', );

router.post('/save-settings', );

//All related to code-environment

//code controller add middleware for auth
router.post('/save-code', );

//code controller add middleware for auth
router.delete('/delete-code/:id', );



module.exports = router;