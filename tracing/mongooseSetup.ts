const mongoose = require('mongoose');

// Mongoose Setup

const mongooseURI = process.env.mongoURI;

// using older version of mongoose, so need to set strictQuery
mongoose.set('strictQuery', true);

mongoose
  .connect(mongooseURI as string, {
    // @ts-ignore
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'Movies',
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err: any) => console.log('Error connecting to DB: ', err));
