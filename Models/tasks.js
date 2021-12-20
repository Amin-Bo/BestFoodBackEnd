const  mongoose  = require("mongoose");
const taskSchema = mongoose.Schema({
    name:{type : String , required:true},
    done:{type : Boolean},
    owner:{type : String , required:true}
});
const Task = mongoose.model('Task',taskSchema);
module.exports=Task;
