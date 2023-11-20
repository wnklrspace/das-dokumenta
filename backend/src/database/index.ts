const mongoose = require('mongoose')

export const MongoUri = 'mongodb+srv://flo:z5kvEn6gxVOGYKHG@bloomcluster.d3d8oqr.mongodb.net/'

const connectDB = () => {
  mongoose
    .connect(MongoUri, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log('Connected to DB'))
    .catch((err: Error) => console.log(err))
}

export default connectDB
