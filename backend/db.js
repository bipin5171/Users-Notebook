const mongoose = require('mongoose');

const connectToMongo = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/user_reg',{serverApi:{version:'1'}});
    console.log('Connected to Mongo Successfully');
  } catch (error) {
    console.error(error);
  }
};
module.exports = connectToMongo;
