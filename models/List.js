const mongoose = require("mongoose");


const ListSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    priority: {
        type: String,
        enum: ['High Priority','Medium Priority', 'Low Priority'],
        required : true,

    },
    status: {
        type: String,
        enum: ['Backlog','To Do', 'In Progress', 'Done'],
        required : true,

    },

    title: {
        type : String,
        required : true,
    },
    checklist: [{
        description: String,
        checked: Boolean  
    }], //Array of to-do options

    dueDate: {
        type :Date,
        required : false,
    }, 
  },  {
    timestamps: true // This will add createdAt and updatedAt fields
  });
  module.exports = mongoose.model('List', ListSchema);
  