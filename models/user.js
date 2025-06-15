import mongoose from 'mongoose' ;

const userSchema = new mongoose.Schema({
   name :{
      type : String ,
      unique : true ,
      required : true 
   },
   age : {type : Number,
      required : true ,
   } ,
   password : {type : String ,
      required : true ,
      unique : true ,
   },
    email :{
      type : String ,
      required : true ,
    }
});

 let content = mongoose.model('user' , userSchema);
//  module.exports
export default content;