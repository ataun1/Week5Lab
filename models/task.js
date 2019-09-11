let mongoose = require('mongoose');

let taskSchema = mongoose.Schema({
    taskName: {
        type: String
    },
    assignTo: String,
    taskDue: {
        type: Date,
    },
    taskStatus: {
        type: String,
        enum: ['In Progress', 'Complete'],
        default: 'In Progress'
    },
    taskDesc: {
        type: String
    }

})

module.exports = mongoose.model('Task',taskSchema);