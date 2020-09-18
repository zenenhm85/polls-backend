const { Schema, model } = require("mongoose");

const UserPollSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    poll: {
        type: Schema.Types.ObjectId,
        ref: 'Poll',
        required: true
    },
    edited:{
        type:Boolean,
        default:false
    },
    vote:{
        type:String        
    }  
    
});


UserPollSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = model("UserPoll", UserPollSchema);
