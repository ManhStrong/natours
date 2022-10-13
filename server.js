const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');
//const { text } = require('express');c
process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
  });
  
  dotenv.config({ path: './config.env' });
  const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD)
  mongoose.
  connect(DB,{
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: true,
      useUnifiedTopology: true
  }).then(con=>{
      //console.log(con.connections);
      console.log("Connect successfull!")
  })

// const testTour = new Tour({
//     name: "Hello",
//     rating: 4.7,
//     price: 270
// })
// testTour.save().then(doc=>{
//     console.log(doc);
// })
// .catch(error=>{
//     console.log('ERROR', error)
// })

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}`)
});
process.on('unhandledRejection',err=>{
    console.log(err.name,err.message);
    console.log('UNHANDLE REJECTION');
    server.close(()=>{
        process.exit(1);
    })
})
process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});