const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const cookieParser = require('cookie-parser');
const AppError = require('./until/appFeatures');
const globalErrorHandle = require('./controller/errController');
const viewRouter = require('./router/viewRouter');

const app = express();
app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));


app.use(helmet());
// eslint-disable-next-line import/order
const morgan = require('morgan');

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
//app.use(morgan('dev'));
app.use(express.json());
app.use(mongoSanitize());
app.use(xss());
app.use(
    hpp({
      whitelist: [
        'duration',
        'ratingsQuantity',
        'ratingsAverage',
        'maxGroupSize',
        'difficulty',
        'price'
      ]
    })
  );




//app.use(express.static(`${__dirname}/public`));
//app.use(express.static(path.join(__dirname,'public')));
const userRouter = require('./router/usersRoutes');
const tourRouter = require('./router/toursRoutes');
const reviewRouter = require('./router/reviewRoutes');
// app.get('/', (req, res) => {
//     res.status(200).json({ message: 'Hello', app: 'Client server' });
// })
// app.post('/', (req, res) => {
//     res.send("Hello World");
// })

//test MidleWare
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    console.log(req.cookies);
    next();
})

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);
app.use(cookieParser());

// app.get('/',(req,res)=>{
//   res.status(200).render('base',{
//     tour: "Co lam co an",
//     user:"Khong co nha"
//   });
// })
// app.get('/overview',(req,res)=>{
//   res.status(200).render('overview',{
//     title: "OverView"
//   });
// })
// app.get('/tour',(req,res)=>{
//   res.status(200).render('tour',{
//     title: "Detail Tour"
//   });
// })

app.use('/',viewRouter);
app.use('/api/v1/users/', userRouter)
app.use('/api/v1/tours/', tourRouter)
app.use('/api/v1/reviews/', reviewRouter)
app.all('*', (req,res,next)=>{
    // res.status(404).json({
    //     status: "fail",
    //     message: `Can not access ${req.originalUrl} this server`
    // })

    // const err = new Error(`Can not access ${req.originalUrl} this server`);
    // err.status = 'fail';
    // err.statusCode = 404;
    next(new AppError(`Can not access ${req.originalUrl} this server`,404));
});
app.use(
    globalErrorHandle
//     (err,req,res,next)=>{
//     err.statusCode = err.statusCode || 500;
//     err.status = err.status || 'error'
//     res.status(err.statusCode).json({
//         status: err.status,
//         message: err.message
//     })
// }
);
module.exports = app;
