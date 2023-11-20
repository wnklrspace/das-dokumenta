const mongoose = require('mongoose')

export const MongoUri = 'mongodb://database:27017/dokumenta'

const connectDB = () => {
  mongoose
    .connect(MongoUri, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log('Connected to DB'))
    .catch((err: Error) => console.log(err))
}

export default connectDB
