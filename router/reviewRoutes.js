const express = require('express');
const reViewController = require("../controller/reviewController");
const authController = require("../controller/authController");

const router = express.Router({mergeParams: true});

router.use(authController.protect);

router.route('/').get(reViewController.getAllReviews)
.post(authController.restrictTo('user'),reViewController.setTourUserIds, reViewController.createReview)

router.route('/:id')
.get(reViewController.getReview)
.delete(authController.restrictTo('user','admin'), reViewController.deleteReview)
.patch(authController.restrictTo('user','admin'), reViewController.updateReview);
module.exports = router;