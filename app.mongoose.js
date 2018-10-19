const mongoose = require('mongoose');
const shortid = require('shortid');


mongoose.connect(process.env.MLAB_URI);

const userSchema = mongoose.Schema({
    user_id:{type:String,required:true},
    username:{type:String,required:true},
    count:{type:Number,required:true,default:0},
    log: [{description:{type:String,required:true},
                 duration:{type:Number,required:true},
                 date:{type:Date, required:true}
          }
         ]
})


const USER = mongoose.model('USER',userSchema);

module.exports = {USER};