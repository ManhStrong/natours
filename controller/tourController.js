const express = require('express')
const fs = require('fs');
//const { dirname } = require('path');
const Tour = require('../models/tourmodel');
const AppError = require('../until/appError');
const APIFeatures = require('../until/appFeatures');
const catchAsync = require("../until/catchAsync");
const factory = require('./handleFactory');

exports.aliasTopTour = (req,res,next) =>{
    req.query.limit = 5;
    req.query.sort = '-ratingAverage,price';
    next();
}
exports.getTourStats = catchAsync(async (req , res,next)=>{
    const stas = await Tour.aggregate([
        {
        $match: {ratingsAverage: {$gte: 4.5}}
        },
        {
        $group: {
            _id: '$difficulty',
            numTour: {$sum: 1},
            avgRating: {$avg: "$ratingsAverage"},
            avgPrice: {$avg: "$price"},
            minPrice: {$min: "$price"},
            maxPrice: {$max: "$price"}

        }
        },
        {
            $sort: {
                avgPrice: 1
            }
        },
        {
            $match: {_id:{$ne: '$easy'}}
        }
    ])
    res.status(200).json({
        status: 'success',
        data: {
            stas
        }
    })
});
exports.getMonthPlan = catchAsync(async (req,res,next) =>{
    const year = req.params.year*1;
    const plan = await Tour.aggregate([
    {
        $unwind: "$startDates"
    },
    {
        $match:{
            startDates:{
                $gte: new Date(`${year}-01-01`),
                $lte: new Date(`${year}-12-31`)
            }
        },
    },
    {
        $group:{
            _id: {$month: '$startDates'},
            numTourStarts: {$sum: 1},
            tours: {$push: "$name"}
        }
    },
    {
        $addFields:{
            month: '$_id',
        }
    },
    {
        $project:{
            _id: 0
        }
    },
    {
        $sort:{
            numTourStarts:-1
        }
    }
    // {
    //     $limit:6
    // }
]);
    res.status(200).json({
        status: 'success',
        data: {
            plan
        }
    })
});


// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/233/center/34.111745,-118.113491/unit/mi
exports.getToursWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
  
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  
    if (!lat || !lng) {
      next(
        new AppError(
          'Please provide latitutr and longitude in the format lat,lng.',
          400
        )
      );
    }
  
    const tours = await Tour.find({
      startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });
  
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        data: tours
      }
    });
  });

exports.getDistances = catchAsync(async (req, res, next) => {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
  
    const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
  
    if (!lat || !lng) {
      next(
        new AppError(
          'Please provide latitutr and longitude in the format lat,lng.',
          400
        )
      );
    }
  
    const distances = await Tour.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [lng * 1, lat * 1]
          },
          distanceField: 'distance',
          distanceMultiplier: multiplier
        }
      },
      {
        $project: {
          distance: 1,
          name: 1
        }
      }
    ]);
  
    res.status(200).json({
      status: 'success',
      data: {
        data: distances
      }
    });
  });
  