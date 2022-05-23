const express = require('express');
const { register, login, getMe, forgotPassword, resetPassword, updatedetails, updatePassword } = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middlerware/auth')

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updatedetails);
router.put('/updatepassword', protect, updatePassword);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;
