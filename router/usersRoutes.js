const express = require('express')
const userController = require('../controller/userController');
const authController = require("../controller/authController");
const { route } = require('./reviewRoutes');

//app.use('api/v1/users/', userRouter)
const router = express.Router();
router.post('/signup',authController.signup);
router.post('/login',authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);
router.patch(
    '/updateMyPassword',
    // authController.protect,
    authController.updatePassword
    );
    
    
router.patch('/updateMe', /*authController.protect,*/ userController.updateMe);
router.delete('/deleteMe', /*authController.protect,*/ userController.deleteMe);
router.get('/me',/*authController.protect,*/userController.getMe,userController.getUser);
    

router.use(authController.restrictTo('admin'));
router.route('/')
        .get(userController.getAllUsers)
        .post(userController.createUser)


router.route('/:id')
    .get(userController.getUser)
    .patch(userController.updatedUser)
    .delete(userController.deleteUser)
//router.get('/me',authController.protect,userController.getMe,userController.getUser);
module.exports = router
