// const mongoose = require('mongoose');
import mongoose from 'mongoose' ;

const contentSchema = new mongoose.Schema({
    text :{
        type : String ,
         required : true ,
    },
    file :{
        type : String ,
        
    }
});
const content =  mongoose.model('text' , contentSchema);

// module.exports = content ;
export default content;
