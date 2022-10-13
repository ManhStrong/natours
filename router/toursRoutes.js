const express = require('express')
const tourController = require('../controller/tourController')
const authorController = require("../controller/authController");
const reviewController = require("../controller/reviewController");
const reviewRouter = require("./reviewRoutes");

const router = express.Router()
//router.param('id', tourController.checkID)
// router.route('')

router.use('/:tourID/reviews', reviewRouter);

router.route('/top-5-cheap').get(tourController.aliasTopTour,tourController.getAllTours)
router.route('/tour-stas').get(tourController.getTourStats);
router.route('/tour-plan/:year').get(authorController.protect,authorController.restrictTo('admin','lead-guide','guide'),tourController.getMonthPlan);

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);
// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
    .route('/')
    .get(tourController.getAllTours)
    .post(authorController.protect,authorController.restrictTo('admin','lead-guide')/*tourController.checkBody,*/, tourController.createTour)
router.route('/:id')
    .get(tourController.getTour)
    .patch(authorController.protect,authorController.restrictTo('admin','lead-guide'),tourController.updateTour)
    .delete(authorController.protect,authorController.restrictTo('admin','lead-guide'),tourController.deleteTour)
//router.route('/:tourID/reviews').post(authorController.protect,authorController.restrictTo('user'),reviewController.createReview);
module.exports = router
