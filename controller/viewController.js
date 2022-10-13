const Tour = require("../models/tourmodel");
const AppError = require("../until/appError");
const catchAsync = require("../until/catchAsync");

exports.getOverView = catchAsync(async(req,res)=>{
    // 1.get data from collection
    const tours = await Tour.find();
    //2 Build templete
    //3 Render templete using tour data from 1
    res.status(200).render('overview',{
      tours
    });
  }
);
exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating'
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }

  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour
  });
});
exports.getLoginForm = catchAsync(async( req,res,next)=>{
  res.status(200).render('login',{
    title: 'Login Form'
  })
})
