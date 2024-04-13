const mongoose = require('mongoose');

const { Schema } = mongoose;

const studentSchema = new Schema({
     name:{
        type: String,
        requred: true
     },
    email:{
        type: String,
        requred: true,
        unique: true
     },
     password:{
        type: String,
        requred: true
     },
     timstamp:{
        type: String,
        requred: true
     },
});

module.exports =mongoose.model(`user`,studentSchema);